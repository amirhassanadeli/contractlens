from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Contract
from .serializers import (
    ContractCreateSerializer,
    ContractListSerializer,
    QuestionSerializer,
)
from .services.contract_service import ContractService
from .services.rag_service import RAGService


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
