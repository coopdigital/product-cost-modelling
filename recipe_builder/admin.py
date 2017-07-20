from django.contrib import admin

from recipe_builder.models import Commodity


class CommodityAdmin(admin.ModelAdmin):
    list_display = ('commodity_code', 'name', 'description')
    search_fields = ('commodity_code', 'name', 'description')


admin.site.register(Commodity, CommodityAdmin)
