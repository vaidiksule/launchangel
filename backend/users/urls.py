from django.urls import path
from .views import (
    GoogleAuthView,
    UpdateRoleView,
    InstagramConnectView,
    InstagramCallbackView,
    DataDeletionView,
    InstagramManualConnectView,
    InstagramDisconnectView,
    VerifyInstagramUsernameView,
)

urlpatterns = [
    path("auth/google/", GoogleAuthView.as_view(), name="google-auth"),
    path("update-role/", UpdateRoleView.as_view(), name="update-role"),
    path(
        "auth/instagram/connect/",
        InstagramConnectView.as_view(),
        name="instagram-connect",
    ),
    path(
        "auth/instagram/callback/",
        InstagramCallbackView.as_view(),
        name="instagram-callback",
    ),
    path("data-delete/", DataDeletionView.as_view(), name="data-delete"),
    path(
        "auth/instagram/manual/",
        InstagramManualConnectView.as_view(),
        name="instagram-manual",
    ),
    path(
        "auth/instagram/disconnect/",
        InstagramDisconnectView.as_view(),
        name="instagram-disconnect",
    ),
    path(
        "auth/instagram/verify/",
        VerifyInstagramUsernameView.as_view(),
        name="instagram-verify",
    ),
]
