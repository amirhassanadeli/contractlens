from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ContractViewSet,
    ConversationViewSet,
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
]