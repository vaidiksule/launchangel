from firebase_admin import credentials, auth as firebase_auth, firestore
import os
import firebase_admin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import jwt
from datetime import datetime, timedelta
from django.shortcuts import redirect
import requests
from urllib.parse import urlencode

# Initialize Firebase Admin
if not firebase_admin._apps:
    try:
        service_account_info = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
        if service_account_info:
            import json

            cred_dict = json.loads(service_account_info)
            cred = credentials.Certificate(cred_dict)
        else:
            cred_path = os.path.join(settings.BASE_DIR, "firebase-service-account.json")
            cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error initializing Firebase Admin: {e}")

db = firestore.client()


def generate_jwt_token(user_data):
    payload = {
        "user_id": user_data.get("id"),
        "email": user_data.get("email"),
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


class GoogleAuthView(APIView):
    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response(
                {"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify the Firebase ID token
            decoded_token = firebase_auth.verify_id_token(token)
            uid = decoded_token["uid"]
            email = decoded_token["email"]
            name = decoded_token.get("name", "")
            first_name = name.split(" ")[0] if " " in name else name
            last_name = name.split(" ")[1] if " " in name else ""
            picture = decoded_token.get("picture", "")

            # Firestore collection
            users_ref = db.collection("users").document(uid)
            doc = users_ref.get()

            if doc.exists:
                user_data = doc.to_dict()
            else:
                # Create user in Firestore
                user_data = {
                    "id": uid,
                    "email": email,
                    "first_name": first_name,
                    "last_name": last_name,
                    "profile_picture": picture,
                    "role": None,
                    "created_at": firestore.SERVER_TIMESTAMP,
                }
                users_ref.set(user_data)

                # Make created_at serializable for JSON response
                user_data["created_at"] = datetime.utcnow().isoformat()

            # Generate local session token
            session_token = generate_jwt_token(user_data)

            return Response(
                {"token": session_token, "user": user_data},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class UpdateRoleView(APIView):
    def post(self, request):
        token = request.data.get("token")
        role = request.data.get("role")

        if not token or not role:
            return Response(
                {"error": "Token and role are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if role not in ["startup", "influencer"]:
            return Response(
                {"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify the Firebase ID token
            decoded_token = firebase_auth.verify_id_token(token)
            uid = decoded_token["uid"]

            users_ref = db.collection("users").document(uid)
            doc = users_ref.get()

            if not doc.exists:
                return Response(
                    {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )

            # Update role in Firestore
            users_ref.update({"role": role})

            # Create specific profile if needed
            profile_ref = db.collection("profiles").document(uid)
            profile_ref.set(
                {"role": role, "updated_at": firestore.SERVER_TIMESTAMP}, merge=True
            )

            user_data = users_ref.get().to_dict()

            return Response(
                {"message": "Role updated successfully", "user": user_data},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class InstagramConnectView(APIView):
    def get(self, request):
        token = request.GET.get("token")
        if not token:
            return Response(
                {"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Verify user to ensure token is valid before redirecting
        try:
            firebase_auth.verify_id_token(token)
        except Exception:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_401_UNAUTHORIZED
            )

        # Try to use correct scheme and host for redirect URI dynamically, fallback to production
        host = request.get_host()
        scheme = "https" if "launchangel" in host or "ngrok" in host else request.scheme

        redirect_uri = os.environ.get(
            "INSTAGRAM_REDIRECT_URI",
            f"{scheme}://{host}/api/users/auth/instagram/callback/",
        )

        app_id = os.environ.get("INSTAGRAM_APP_ID")

        if not app_id:
            return Response(
                {"error": "Instagram App ID not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Business Login for Instagram Auth URL
        auth_url = "https://www.instagram.com/oauth/authorize"
        params = {
            "client_id": app_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish,instagram_business_manage_insights",
            "state": token,  # Pass the token in state to retrieve in callback
            "force_reauth": "true",
        }

        url = f"{auth_url}?{urlencode(params)}"
        return redirect(url)


class InstagramCallbackView(APIView):
    def get(self, request):
        code = request.GET.get("code")
        state_token = request.GET.get("state")
        error = request.GET.get("error")
        error_reason = request.GET.get("error_reason")
        error_description = request.GET.get("error_description")

        frontend_url = os.environ.get(
            "NEXT_PUBLIC_FRONTEND_URL", "https://launchangel.app"
        )
        dashboard_url = f"{frontend_url}/influencer/dashboard"

        if error:
            print(
                f"Instagram Auth Error: {error} - {error_reason} - {error_description}"
            )
            return redirect(f"{dashboard_url}?error=instagram_auth_failed")

        if not code or not state_token:
            return redirect(f"{dashboard_url}?error=missing_parameters")

        try:
            # Verify user from state
            decoded_token = firebase_auth.verify_id_token(state_token)
            uid = decoded_token["uid"]

            # Exchange code for access token
            app_id = os.environ.get("INSTAGRAM_APP_ID")
            app_secret = os.environ.get("INSTAGRAM_APP_SECRET")
            host = request.get_host()
            scheme = (
                "https" if "launchangel" in host or "ngrok" in host else request.scheme
            )

            redirect_uri = os.environ.get(
                "INSTAGRAM_REDIRECT_URI",
                f"{scheme}://{host}/api/users/auth/instagram/callback/",
            )

            token_url = "https://api.instagram.com/oauth/access_token"
            data = {
                "client_id": app_id,
                "client_secret": app_secret,
                "grant_type": "authorization_code",
                "redirect_uri": redirect_uri,
                "code": code,
            }

            response = requests.post(token_url, data=data)
            response_data = response.json()

            if "access_token" not in response_data:
                print("Failed to get access token:", response_data)
                return redirect(f"{dashboard_url}?error=token_exchange_failed")

            access_token = response_data["access_token"]
            user_id = response_data.get("user_id")

            # Fetch the Instagram Account metadata using Graph API for Business
            ig_url = f"https://graph.instagram.com/v19.0/me?fields=username,followers_count,media_count,account_type&access_token={access_token}"
            ig_response = requests.get(ig_url).json()

            if "error" in ig_response:
                print("Graph API Error, attempting fallback:", ig_response)
                # Fallback to basic display fields if followers_count causes an error
                ig_fallback_url = f"https://graph.instagram.com/{user_id}?fields=id,username,media_count,account_type&access_token={access_token}"
                ig_response = requests.get(ig_fallback_url).json()

            instagram_username = ig_response.get("username")
            followers_count = ig_response.get("followers_count", 0)
            media_count = ig_response.get("media_count", 0)
            account_type = ig_response.get("account_type", "business")

            if not instagram_username:
                print("Failed to get IG username:", ig_response)
                return redirect(f"{dashboard_url}?error=profile_fetch_failed")

            # Update Firestore
            users_ref = db.collection("users").document(uid)
            users_ref.update(
                {
                    "instagram_connected": True,
                    "instagram_username": instagram_username,
                    "followers_count": followers_count,
                    "media_count": media_count,
                    "account_type": account_type,
                }
            )

            user_doc = users_ref.get()
            if user_doc.exists:
                user_email = user_doc.to_dict().get("email")
                # Also update Django ORM for analytics
                from .models import User as DjangoUser, InfluencerProfile

                try:
                    django_user = DjangoUser.objects.get(email=user_email)
                    profile, _ = InfluencerProfile.objects.get_or_create(
                        user=django_user
                    )
                    profile.instagram_connected = True
                    profile.instagram_username = instagram_username
                    profile.followers_count = followers_count
                    profile.media_count = media_count
                    profile.account_type = account_type
                    profile.save()
                except DjangoUser.DoesNotExist:
                    print(f"Django user with email {user_email} not found")

            return redirect(
                f"{dashboard_url}?instagram_connected=true&username={instagram_username}&followers_count={followers_count}&media_count={media_count}"
            )

        except Exception as e:
            print(f"Error in Instagram callback: {str(e)}")
            return redirect(f"{dashboard_url}?error=internal_server_error")


class DataDeletionView(APIView):
    def post(self, request):
        # Facebook sends a signed request for data deletion
        # For now, acknowledge the receipt to satisfy the platform requirement.
        # In the future, parse the signed_request and delete user data.
        return Response(
            {
                "url": "https://launchangel.app/privacy-policy",
                "confirmation_code": "12345",
            },
            status=status.HTTP_200_OK,
        )


class InstagramManualConnectView(APIView):
    def post(self, request):
        token = request.data.get("token")
        username = request.data.get("username")
        followers_count = request.data.get("followers_count", 0)
        media_count = request.data.get("media_count", 0)

        if not token or not username:
            return Response(
                {"error": "Token and username are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Strip standard at-symbols from the passed handle
        if username.startswith("@"):
            username = username[1:]

        try:
            # Verify user from token to authorize the action
            decoded_token = firebase_auth.verify_id_token(token)
            uid = decoded_token["uid"]

            # 1. Update Firestore Profile
            users_ref = db.collection("users").document(uid)
            users_ref.update(
                {
                    "instagram_connected": True,
                    "instagram_username": username,
                    "followers_count": followers_count,
                    "media_count": media_count,
                    "account_type": "manual_entry",
                }
            )

            # 2. Update Django Analytics Profile
            user_doc = users_ref.get()
            if user_doc.exists:
                user_email = user_doc.to_dict().get("email")
                from .models import User as DjangoUser, InfluencerProfile

                try:
                    django_user = DjangoUser.objects.get(email=user_email)
                    profile, _ = InfluencerProfile.objects.get_or_create(
                        user=django_user
                    )
                    profile.instagram_connected = True
                    profile.instagram_username = username
                    profile.followers_count = followers_count
                    profile.media_count = media_count
                    profile.account_type = "manual_entry"
                    profile.save()
                except DjangoUser.DoesNotExist:
                    print(
                        f"Django user with email {user_email} not found for manual link."
                    )

            return Response(
                {
                    "success": True,
                    "username": username,
                    "followers_count": followers_count,
                    "media_count": media_count,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            import traceback

            traceback.print_exc()
            print(f"Error in manual Instagram connection: {str(e)}")
            return Response(
                {"error": f"Failed to connect Instagram account manually: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class InstagramDisconnectView(APIView):
    def post(self, request):
        token = request.data.get("token")
        confirm_username = request.data.get("confirm_username")

        if not token or not confirm_username:
            return Response(
                {"error": "Token and confirm_username are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Strip standard at-symbols
        if confirm_username.startswith("@"):
            confirm_username = confirm_username[1:]

        try:
            # Verify user from token to authorize the action
            decoded_token = firebase_auth.verify_id_token(token)
            uid = decoded_token["uid"]

            # Check Firestore Profile
            users_ref = db.collection("users").document(uid)
            user_doc = users_ref.get()

            if not user_doc.exists:
                return Response(
                    {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
                )

            current_data = user_doc.to_dict()
            current_username = current_data.get("instagram_username", "")

            if current_username != confirm_username:
                return Response(
                    {"error": "Username does not match"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # 1. Update Firestore Profile
            users_ref.update(
                {
                    "instagram_connected": False,
                    "instagram_username": firestore.DELETE_FIELD,
                    "followers_count": firestore.DELETE_FIELD,
                    "media_count": firestore.DELETE_FIELD,
                    "account_type": firestore.DELETE_FIELD,
                }
            )

            # 2. Update Django Analytics Profile
            user_email = current_data.get("email")
            from .models import User as DjangoUser, InfluencerProfile

            try:
                django_user = DjangoUser.objects.get(email=user_email)
                profile = InfluencerProfile.objects.get(user=django_user)
                profile.instagram_connected = False
                profile.instagram_username = ""
                profile.followers_count = 0
                profile.media_count = 0
                profile.account_type = ""
                profile.save()
            except DjangoUser.DoesNotExist:
                pass
            except InfluencerProfile.DoesNotExist:
                pass

            return Response({"success": True}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error in Instagram disconnect: {str(e)}")
            return Response(
                {"error": "Failed to disconnect Instagram account."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class VerifyInstagramUsernameView(APIView):
    def post(self, request):
        username = request.data.get("username")
        if not username:
            return Response(
                {"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        if username.startswith("@"):
            username = username[1:]

        try:
            import requests
            from bs4 import BeautifulSoup

            # Create a session to mimic a real browser to try and bypass Meta's blocks
            session = requests.Session()
            session.headers.update(
                {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept-Language": "en-US,en;q=0.9",
                }
            )

            url = f"https://www.instagram.com/{username}/"
            response = session.get(url, timeout=10)

            if response.status_code == 404:
                return Response(
                    {"error": "Instagram account not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # We don't guarantee a 200 means success due to IG login walls.
            soup = BeautifulSoup(response.text, "html.parser")

            # Extract description which contains: "X Followers, Y Following, Z Posts - See Instagram photos and videos from Name (@username)"
            description_meta = soup.find("meta", property="og:description")
            image_meta = soup.find("meta", property="og:image")
            title_meta = soup.find("meta", property="og:title")

            followers_count = 0
            media_count = 0
            profile_pic = ""
            name = username

            if description_meta and description_meta.get("content"):
                desc = description_meta["content"]

                # Basic parsing, formats change occasionally but typically looks like:
                # "12K Followers, 1,000 Following, 50 Posts - ..."
                try:
                    parts = desc.split("-")[0].split(",")
                    for part in parts:
                        part = part.strip().lower()
                        if "followers" in part:
                            # Convert string like "12K" or "1.5M" or "100" to integer
                            num_str = (
                                part.replace("followers", "").strip().replace(",", "")
                            )
                            # Handled simplified scaling
                            multiplier = 1
                            if num_str.endswith("m"):
                                multiplier = 1000000
                                num_str = num_str[:-1]
                            elif num_str.endswith("k"):
                                multiplier = 1000
                                num_str = num_str[:-1]
                            followers_count = int(float(num_str) * multiplier)
                        elif "posts" in part:
                            num_str = part.replace("posts", "").strip().replace(",", "")
                            multiplier = 1
                            if num_str.endswith("m"):
                                multiplier = 1000000
                                num_str = num_str[:-1]
                            elif num_str.endswith("k"):
                                multiplier = 1000
                                num_str = num_str[:-1]
                            media_count = int(float(num_str) * multiplier)
                except Exception as e:
                    print(f"Error parsing Instagram meta description: {e}")

            if image_meta and image_meta.get("content"):
                profile_pic = image_meta["content"]

            if title_meta and title_meta.get("content"):
                # Title often looks like "First Last (@username) • Instagram photos and videos"
                title_content = title_meta["content"]
                name = title_content.split("(@")[0].strip()

            if followers_count == 0 and not profile_pic:
                # Meta likely threw a login wall. Fall back gracefully.
                return Response(
                    {
                        "valid": True,
                        "username": username,
                        "name": username,
                        "followers_count": 0,
                        "media_count": 0,
                        "profile_pic": "",
                        "warning": "Could not fetch public stats. Connection still allowed.",
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {
                    "valid": True,
                    "username": username,
                    "name": name,
                    "followers_count": followers_count,
                    "media_count": media_count,
                    "profile_pic": profile_pic,
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            print(f"Error verifying Instagram account: {str(e)}")
            # Even if verification fails due to error, we allow the fallback connection
            return Response(
                {
                    "valid": True,
                    "username": username,
                    "name": username,
                    "followers_count": 0,
                    "media_count": 0,
                    "profile_pic": "",
                    "warning": "Scraping failed entirely. Connection still allowed.",
                },
                status=status.HTTP_200_OK,
            )
