from apps.contracts.models import Contract

from .pdf_service import PDFService
from .chunk_service import ChunkService
from .embedding_service import EmbeddingService


class ContractService:

    @staticmethod
    def create_contract(data: dict) -> Contract:

        # 1. Save Contract
        contract = Contract.objects.create(**data)

        # 2. Load PDF
        documents = PDFService.load_documents(
            contract.file.path
        )

        # 3. Split Documents
        chunks = ChunkService.split_documents(
            documents
        )

        # 4. Set real filename/title in chunk metadata
        display_name = f"{contract.title}.pdf" if not contract.title.endswith(".pdf") else contract.title
        for chunk in chunks:
            chunk.metadata["filename"] = display_name
            chunk.metadata["contract_id"] = str(contract.id)

        # 5. Save Chunks into Chroma
        EmbeddingService.add_documents(
            contract_id=str(contract.id),
            chunks=chunks,
        )

        return contract
