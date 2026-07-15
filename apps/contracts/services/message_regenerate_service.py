from apps.contracts.models import (
    Message,
    MessageRole,
)

from .rag_service import RAGService


class MessageRegenerateService:

    @staticmethod
    def regenerate(message: Message) -> Message:
        """
        Regenerate an assistant response.
        """

        if message.role != MessageRole.ASSISTANT:
            raise ValueError(
                "Only assistant messages can be regenerated."
            )

        user_message = (
            Message.objects.filter(
                conversation=message.conversation,
                role=MessageRole.USER,
                created_at__lt=message.created_at,
            )
            .order_by("-created_at")
            .first()
        )

        if user_message is None:
            raise ValueError(
                "User message not found."
            )

        result = RAGService.ask(
            contract_id=str(
                message.conversation.contract.id
            ),
            question=user_message.content,
        )

        regenerated_message = Message.objects.create(
            conversation=message.conversation,
            role=MessageRole.ASSISTANT,
            content=result["answer"],
            sources=result["sources"],
            regenerated_from=message,
        )

        return regenerated_message