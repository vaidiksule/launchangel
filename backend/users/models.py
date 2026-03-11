from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ("startup", "Startup"),
        ("influencer", "Influencer"),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, null=True, blank=True)
    google_id = models.CharField(max_length=100, unique=True, null=True, blank=True)
    profile_picture = models.URLField(max_length=500, null=True, blank=True)

    def __str__(self):
        return self.email or self.username


class StartupProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="startup_profile"
    )
    company_name = models.CharField(max_length=255, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    industry = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.company_name or f"Startup {self.user.id}"


class InfluencerProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="influencer_profile"
    )
    instagram_connected = models.BooleanField(default=False)
    instagram_username = models.CharField(max_length=255, null=True, blank=True)
    instagram_handle = models.CharField(max_length=100, null=True, blank=True)
    niche = models.CharField(max_length=100, null=True, blank=True)
    followers_count = models.IntegerField(default=0)
    media_count = models.IntegerField(default=0)
    account_type = models.CharField(max_length=50, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    engagement_rate = models.FloatField(default=0.0)

    def __str__(self):
        return f"@{self.instagram_handle}" or f"Influencer {self.user.id}"
