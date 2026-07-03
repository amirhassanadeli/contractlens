from rest_framework import status, viewsets
from rest_framework.response import Response

from .models import Contract
from .serializers import (
    ContractCreateSerializer,
    ContractListSerializer,
)
from .services import ContractService


class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()

    def get_serializer_class(self):
        if self.action == "create":
            return ContractCreateSerializer

        return ContractListSerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        contract = ContractService.create_contract(
            validated_data=serializer.validated_data
        )

        response_serializer = ContractListSerializer(contract)

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED,
        )