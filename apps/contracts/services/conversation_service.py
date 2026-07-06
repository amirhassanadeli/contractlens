from apps.contracts.models import (
    Contract,
    Conversation,
)


class ConversationService:

    @staticmethod
    def create(
        contract: Contract,
        title: str = "",
    ) -> Conversation:
        """
        Create a new conversation for a contract.
        """

        return Conversation.objects.create(
            contract=contract,
            title=title,
        )

    @staticmethod
    def get(
        conversation_id: str,
    ) -> Conversation:
        """
        Return a conversation by id.
        """

        return Conversation.objects.get(
            id=conversation_id,
        )

    @staticmethod
    def list(
        contract: Contract,
    ):
        """
        Return all conversations of a contract.
        """

        return contract.conversations.all()