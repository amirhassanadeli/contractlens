from apps.contracts.models import Contract

from .pdf_service import PDFService
from .chunk_service import ChunkService
from .embedding_service import EmbeddingService


class ContractService:

    @staticmethod
    def create_contract(data: dict) -> Contract:

        # Save Contract
        contract = Contract.objects.create(**data)

        # Load PDF
        documents = PDFService.load_documents(
            contract.file.path
        )

        # Split Documents
        chunks = ChunkService.split_documents(
            documents
        )

        # Save Chunks into Chroma
        EmbeddingService.add_documents(
            contract_id=str(contract.id),
            chunks=chunks,
        )

        return contract