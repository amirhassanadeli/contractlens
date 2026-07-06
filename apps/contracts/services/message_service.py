from apps.contracts.models import (
    Conversation,
    Message,
    MessageRole,
)


class MessageService:

    @staticmethod
    def create_user_message(
        conversation: Conversation,
        content: str,
    ) -> Message:

        return Message.objects.create(
            conversation=conversation,
            role=MessageRole.USER,
            content=content,
        )

    @staticmethod
    def create_assistant_message(
        conversation: Conversation,
        content: str,
        sources: list,
    ) -> Message:

        return Message.objects.create(
            conversation=conversation,
            role=MessageRole.ASSISTANT,
            content=content,
            sources=sources,
        )