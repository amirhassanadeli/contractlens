from pathlib import Path

from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document


class PDFService:

    @staticmethod
    def load_documents(file_path: str) -> list[Document]:
        try:
            loader = PyPDFLoader(file_path)
            documents = loader.load()
        except Exception as e:
            raise ValueError(f"Failed to load PDF: {file_path}") from e

        filename = Path(file_path).name

        for document in documents:
            document.metadata.update({
                "filename": filename,
                "page_number": document.metadata.get("page", 0) + 1,
            })

        return documents

