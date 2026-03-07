import os
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from .models import User, StartupProfile, InfluencerProfile
from .serializers import UserSerializer
import jwt
from datetime import datetime, timedelta

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


# Create a simple utility for JWT (since we are not using a heavy library for MVP)
def generate_jwt_token(user):
    payload = {
        "user_id": user.id,
        "email": user.email,
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


class GoogleAuthView(APIView):
    def post(self, request):
        token = request.data.get("token")
        role = request.data.get("role", "startup")  # Default role if first time

        if not token:
            return Response(
                {"error": "Token is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Verify the Firebase ID token
            decoded_token = firebase_auth.verify_id_token(token)

            google_id = decoded_token["uid"]
            email = decoded_token["email"]
            name = decoded_token.get("name", "")
            first_name = name.split(" ")[0] if " " in name else name
            last_name = name.split(" ")[1] if " " in name else ""
            picture = decoded_token.get("picture", "")

            # Create or get user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email,
                    "google_id": google_id,
                    "first_name": first_name,
                    "last_name": last_name,
                    "profile_picture": picture,
                    "role": role,
                },
            )

            # If it's a new user, create their specific profile
            if created:
                if role == "startup":
                    StartupProfile.objects.create(user=user)
                else:
                    InfluencerProfile.objects.create(user=user)

            # Generate local session token
            session_token = generate_jwt_token(user)

            return Response(
                {"token": session_token, "user": UserSerializer(user).data},
                status=status.HTTP_200_OK,
            )

        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
