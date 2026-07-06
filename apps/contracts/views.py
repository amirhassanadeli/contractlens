from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Contract, Conversation
from .serializers import (
    ContractCreateSerializer,
    ContractListSerializer,
    QuestionSerializer,

    ConversationSerializer,
    ConversationCreateSerializer,

)
from .services.contract_service import ContractService
from .services.rag_service import RAGService
from .services.conversation_service import ConversationService


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return ContractCreateSerializer

        if self.action == "chat":
            return QuestionSerializer

        return ContractListSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        contract = ContractService.create_contract(
            serializer.validated_data
        )

        response_serializer = ContractListSerializer(contract)

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["post"],
        url_path="chat",
    )
    def chat(self, request, pk=None):
        serializer = QuestionSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        contract = self.get_object()

        result = RAGService.ask(
            contract_id=str(contract.id),
            question=serializer.validated_data["question"],
        )

        return Response(
            result,
            status=status.HTTP_200_OK,
        )


class ConversationViewSet(viewsets.ViewSet):

    def list(self, request):
        contract_id = request.query_params.get("contract_id")

        if not contract_id:
            return Response(
                {
                    "detail": "contract_id is required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        contract = Contract.objects.get(id=contract_id)

        conversations = ConversationService.list(contract)

        serializer = ConversationSerializer(
            conversations,
            many=True,
        )

        return Response(serializer.data)

    def create(self, request):
        serializer = ConversationCreateSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        contract = Contract.objects.get(
            id=serializer.validated_data["contract_id"],
        )

        conversation = ConversationService.create(
            contract=contract,
            title=serializer.validated_data.get(
                "title",
                "",
            ),
        )

        response_serializer = ConversationSerializer(
            conversation,
        )

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )
