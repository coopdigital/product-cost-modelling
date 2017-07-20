from django.db import models


class Commodity(models.Model):
    commodity_code = models.CharField(max_length=255, primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()

    class Meta:
        verbose_name_plural = 'Commodities'
