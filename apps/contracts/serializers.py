from rest_framework import serializers

from .models import Contract
from pypdf import PdfReader


class ContractListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract

        fields = (
            "id",
            "title",
            "language",
            "status",
            "created_at",
        )


class ContractCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = (
            "title",
            "file",
            "language",
        )

    def validate_file(self, file):
        MAX_FILE_SIZE = 50 * 1024 * 1024

        if file.size == 0:
            raise serializers.ValidationError(
                "File is empty."
            )

        if file.size > MAX_FILE_SIZE:
            raise serializers.ValidationError(
                "Maximum file size is 50 MB."
            )

        if not file.name.lower().endswith(".pdf"):
            raise serializers.ValidationError(
                "Only PDF files are allowed."
            )

        try:
            reader = PdfReader(file)

            if len(reader.pages) == 0:
                raise serializers.ValidationError(
                    "PDF has no pages."
                )

        except Exception:
            raise serializers.ValidationError(
                "Invalid PDF file."
            )

        file.seek(0)

        return file

class QuestionSerializer(serializers.Serializer):
    question = serializers.CharField(
        max_length=255,
    )
