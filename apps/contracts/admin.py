from django.contrib import admin

from .models import Contract


@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "language",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "language",
    )

    search_fields = (
        "title",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )