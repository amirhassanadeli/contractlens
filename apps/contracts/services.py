from .models import Contract


class ContractService:

    @staticmethod
    def create_contract(validated_data):
        return Contract.objects.create(
            **validated_data
        )