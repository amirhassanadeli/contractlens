from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings

from django.conf import settings


class EmbeddingService:
    _vector_store = None

    @staticmethod
    def _get_embeddings() -> OllamaEmbeddings:
        return OllamaEmbeddings(
            model=settings.EMBEDDING_MODEL
        )

    @classmethod
    def get_vector_store(cls) -> Chroma:
        """
        Create (once) and return the Chroma vector database.
        """

        if cls._vector_store is None:
            cls._vector_store = Chroma(
                persist_directory=str(settings.CHROMA_DIR),
                embedding_function=cls._get_embeddings(),
            )

        return cls._vector_store

    @classmethod
    def add_documents(
            cls,
            contract_id: str,
            chunks: list[Document],
    ) -> None:
        """
        Add chunks to Chroma.
        """

        for index, chunk in enumerate(chunks):
            chunk.metadata.update(
                {
                    "contract_id": contract_id,
                    "chunk_id": index,
                }
            )

        vector_store = cls.get_vector_store()

        vector_store.add_documents(chunks)

    @classmethod
    def get_retriever(cls, contract_id: str):
        """
        Return a retriever for the RAG pipeline.
        """

        vector_store = cls.get_vector_store()

        return vector_store.as_retriever(
            search_type="mmr",
            search_kwargs={
                "k": settings.TOP_K,
                "fetch_k": settings.FETCH_K,
                "filter": {"contract_id": contract_id},
            },
        )
