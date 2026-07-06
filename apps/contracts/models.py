import uuid

from django.db import models


class ContractStatus(models.TextChoices):
    UPLOADED = "UPLOADED", "Uploaded"
    PROCESSING = "PROCESSING", "Processing"
    READY = "READY", "Ready"
    FAILED = "FAILED", "Failed"


class Language(models.TextChoices):
    ENGLISH = "EN", "English"
    PERSIAN = "FA", "Persian"
    UNKNOWN = "UNKNOWN", "Unknown"


class MessageRole(models.TextChoices):
    USER = "USER", "User"
    ASSISTANT = "ASSISTANT", "Assistant"


def contract_upload_path(instance, filename):
    extension = filename.split(".")[-1]
    return f"contracts/{instance.id}.{extension}"


class Contract(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    title = models.CharField(
        max_length=255,
    )

    file = models.FileField(
        upload_to=contract_upload_path,
    )

    language = models.CharField(
        max_length=10,
        choices=Language.choices,
        default=Language.UNKNOWN,
    )

    status = models.CharField(
        max_length=20,
        choices=ContractStatus.choices,
        default=ContractStatus.UPLOADED,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class Conversation(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    contract = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name="conversations",
    )

    title = models.CharField(
        max_length=255,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-updated_at"]

    def __str__(self):
        return self.title or f"Conversation {self.id}"


class Message(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    role = models.CharField(
        max_length=20,
        choices=MessageRole.choices,
    )

    content = models.TextField()

    sources = models.JSONField(
        default=list,
        blank=True,
    )

    liked = models.BooleanField(
        null=True,
        blank=True,
    )

    regenerated_from = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="regenerations",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.get_role_display()}: {self.content[:50]}"