from apps.contracts.models import (
    Conversation,
    Message,
    MessageRole,
)

from .rag_service import RAGService


class MessageService:

    @staticmethod
    def send_message(
            conversation: Conversation,
            content: str,
    ) -> Message:
        """
        Save user message, ask the RAG system,
        save assistant response, and return it.
        """

        # Save user message
        Message.objects.create(
            conversation=conversation,
            role=MessageRole.USER,
            content=content,
        )

        # Ask RAG
        print("1. User saved")
        result = RAGService.ask(
            contract_id=str(conversation.contract.id),
            question=content,
        )

        # Save assistant message
        print("2. RAG Result:", result)
        assistant_message = Message.objects.create(
            conversation=conversation,
            role=MessageRole.ASSISTANT,
            content=result["answer"],
            sources=result["sources"],
        )
        print("3. Assistant saved")

        return assistant_message

    @staticmethod
    def history(
            conversation: Conversation,
    ):
        """
        Return all messages of a conversation.
        """

        return conversation.messages.all()
