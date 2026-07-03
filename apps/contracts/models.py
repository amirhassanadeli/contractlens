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
