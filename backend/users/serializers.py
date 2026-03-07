from rest_framework import serializers
from .models import User, StartupProfile, InfluencerProfile


class StartupProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StartupProfile
        fields = ["company_name", "website", "industry"]


class InfluencerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InfluencerProfile
        fields = [
            "instagram_handle",
            "niche",
            "followers_count",
            "bio",
            "engagement_rate",
        ]


class UserSerializer(serializers.ModelSerializer):
    startup_profile = StartupProfileSerializer(read_only=True)
    influencer_profile = InfluencerProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
            "profile_picture",
            "startup_profile",
            "influencer_profile",
        ]
