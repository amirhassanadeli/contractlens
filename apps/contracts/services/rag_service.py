from uuid import uuid4
from django.utils import timezone

from django.conf import settings

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama import ChatOllama

from langchain_classic.chains.combine_documents import (
    create_stuff_documents_chain,
)
from langchain_classic.chains.retrieval import (
    create_retrieval_chain,
)

from .embedding_service import EmbeddingService


class RAGService:

    @staticmethod
    def get_llm():
        """
        Create the LLM (Qwen)
        """
        return ChatOllama(
            model=settings.LLM_MODEL,
            temperature=settings.TEMPERATURE,
        )

    @staticmethod
    def get_prompt():
        """
        Create the prompt
        """

        system_prompt = """
You are an AI legal assistant.

Answer ONLY using the provided context.

If the answer is not in the context, reply:

"I don't know."

Context:
{context}
"""

        return ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", "{input}"),
            ]
        )

    @staticmethod
    def get_chain(contract_id: str):
        llm = RAGService.get_llm()

        prompt = RAGService.get_prompt()

        retriever = EmbeddingService.get_retriever(
            contract_id=contract_id
        )

        question_answer_chain = create_stuff_documents_chain(
            llm,
            prompt,
        )

        retrieval_chain = create_retrieval_chain(
            retriever,
            question_answer_chain,
        )

        return retrieval_chain

    @staticmethod
    def ask(contract_id: str, question: str):
        chain = RAGService.get_chain(
            contract_id=contract_id
        )

        response = chain.invoke(
            {
                "input": question,
            }
        )

        sources = []

        for document in response["context"]:
            sources.append(
                {
                    "filename": document.metadata.get("filename"),
                    "page": document.metadata.get("page_number", 1),
                    "excerpt": document.page_content[:200],
                }
            )

        return {
            "answer": response["answer"],
            "sources": sources,
        }