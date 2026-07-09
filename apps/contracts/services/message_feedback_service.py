from apps.contracts.models import Message


class MessageFeedbackService:

    @staticmethod
    def set_feedback(message: Message, liked: bool) -> Message:
        message.liked = liked
        message.save(update_fields=["liked"])
        return message
