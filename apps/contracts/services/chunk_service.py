from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from backend.settings.base import (
    CHUNK_SIZE,
    CHUNK_OVERLAP,
)


class ChunkService:

    @staticmethod
    def split_documents(documents: list[Document], ) -> list[Document]:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=CHUNK_SIZE,
            chunk_overlap=CHUNK_OVERLAP,
            separators=[
                "\n\n",
                "\n",
                ".",
                "؟",
                "!",
                "؛",
                "،",
                " ",
                "",
            ],
        )

        chunks = splitter.split_documents(documents)

        for index, chunk in enumerate(chunks):
            chunk.metadata.update({
                "chunk_id": index,
                "chunk_size": len(chunk.page_content),
            })

        return chunks
