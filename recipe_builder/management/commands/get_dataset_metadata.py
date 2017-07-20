from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils.html import strip_tags
import quandl

from recipe_builder.commodities import commodities
from recipe_builder.models import Commodity

quandl.ApiConfig.api_key = settings.QUANDL_API_KEY


class Command(BaseCommand):
    help = "Refresh metadata for commodity indexes"
    requires_migrations_checks = True

    def handle(self, *args, **options):
        for group in commodities:
            for commodity in group:
                data = quandl.Dataset(commodity['code'])
                Commodity.objects.update_or_create(
                    commodity_code=commodity['code'],
                    defaults={
                        'name': strip_tags(data.name),
                        'description': strip_tags(data.description),
                    })
