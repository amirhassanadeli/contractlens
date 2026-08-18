import logging
from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Contract, Conversation, Message
from .serializers import (
    ContractCreateSerializer,
    ContractListSerializer,
    QuestionSerializer,
    ConversationSerializer,
    ConversationCreateSerializer,
    MessageSerializer,
    SendMessageSerializer,
    MessageFeedbackSerializer,
)
from .services.contract_service import ContractService
from .services.rag_service import RAGService
from .services.conversation_service import ConversationService
from .services.message_service import MessageService
from .services.message_feedback_service import MessageFeedbackService
from .services.message_regenerate_service import MessageRegenerateService

logger = logging.getLogger(__name__)


class ContractViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return Contract.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return ContractCreateSerializer
        if self.action == "chat":
            return QuestionSerializer
        return ContractListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data.copy()
        data["owner"] = request.user

        contract = ContractService.create_contract(data)
        response_serializer = ContractListSerializer(contract)

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="chat")
    def chat(self, request, pk=None):
        serializer = QuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        contract = self.get_object()

        result = RAGService.ask(
            contract_id=str(contract.id),
            question=serializer.validated_data["question"],
        )

        return Response(result, status=status.HTTP_200_OK)


class ConversationViewSet(viewsets.ViewSet):

    def list(self, request):
        contract_id = request.query_params.get("contract_id")

        if not contract_id:
            return Response(
                {"detail": "contract_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        contract = get_object_or_404(
            Contract,
            id=contract_id,
            owner=request.user,
        )
        conversations = ConversationService.list(contract)
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = ConversationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        contract = get_object_or_404(
            Contract,
            id=serializer.validated_data["contract_id"],
            owner=request.user,
        )

        conversation = ConversationService.create(
            contract=contract,
            title=serializer.validated_data.get("title", ""),
        )

        response_serializer = ConversationSerializer(conversation)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )


class MessageViewSet(viewsets.ViewSet):

    def list(self, request, conversation_pk=None):
        conversation = get_object_or_404(
            Conversation,
            id=conversation_pk,
            contract__owner=request.user,
        )

        messages = MessageService.history(conversation)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    def create(self, request, conversation_pk=None):
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        conversation = get_object_or_404(
            Conversation,
            id=conversation_pk,
            contract__owner=request.user,
        )

        message = MessageService.send_message(
            conversation=conversation,
            content=serializer.validated_data["content"],
        )

        return Response(
            MessageSerializer(message).data,
            status=status.HTTP_201_CREATED,
        )


class MessageActionViewSet(viewsets.ViewSet):

    def partial_update(self, request, pk=None):
        serializer = MessageFeedbackSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = get_object_or_404(
            Message,
            id=pk,
            conversation__contract__owner=request.user,
        )

        message = MessageFeedbackService.set_feedback(
            message=message,
            liked=serializer.validated_data["liked"],
        )

        return Response(
            MessageSerializer(message).data,
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=["post"], url_path="regenerate")
    def regenerate(self, request, pk=None):
        message = get_object_or_404(
            Message,
            id=pk,
            conversation__contract__owner=request.user,
        )

        regenerated_message = MessageRegenerateService.regenerate(message)

        return Response(
            MessageSerializer(regenerated_message).data,
            status=status.HTTP_201_CREATED,
        )
