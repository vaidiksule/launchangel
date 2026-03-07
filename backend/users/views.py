import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
from .models import User, StartupProfile, InfluencerProfile
from .serializers import UserSerializer
import jwt
from datetime import datetime, timedelta


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
            # Verify the ID token
            # CLIENT_ID should be in your .env
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), os.environ.get("GOOGLE_CLIENT_ID")
            )

            if idinfo["iss"] not in [
                "accounts.google.com",
                "https://accounts.google.com",
            ]:
                raise ValueError("Wrong issuer.")

            google_id = idinfo["sub"]
            email = idinfo["email"]
            first_name = idinfo.get("given_name", "")
            last_name = idinfo.get("family_name", "")
            picture = idinfo.get("picture", "")

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
        except Exception:
            return Response(
                {"error": "An internal error occurred"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
