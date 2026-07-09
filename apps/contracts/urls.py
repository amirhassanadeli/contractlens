from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ContractViewSet,
    ConversationViewSet,
    MessageViewSet,
)

router = DefaultRouter()

router.register(
    "contracts",
    ContractViewSet,
    basename="contracts",
)

router.register(
    "conversations",
    ConversationViewSet,
    basename="conversations",
)

urlpatterns = [
    path("", include(router.urls)),

    path(
        "conversations/<uuid:conversation_pk>/messages/",
        MessageViewSet.as_view(
            {
                "get": "list",
                "post": "create",
            }
        ),
        name="conversation-messages",
    ),
]