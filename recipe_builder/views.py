from bokeh.embed import components
from bokeh.plotting import Figure
from django.conf import settings
from django.views.generic import TemplateView
import pandas as pd
import quandl


quandl.ApiConfig.api_key = settings.QUANDL_API_KEY


class RecipeBuilder(TemplateView):
    template_name = 'recipe.html'
    frequency = 'monthly'
    start_date = pd.to_datetime('now') - pd.DateOffset(years=1)
    start_date = start_date.strftime('%Y-%m-%d')

    def get_context_data(self, **kwargs):
        context = super(RecipeBuilder, self).get_context_data(**kwargs)

        commodity_code = 'COM/WHEAT_MN'

        commodity_data = quandl.get(
            commodity_code,
            collapse=self.frequency,
            start_date=self.start_date,
            transformation='normalize')

        currency_code = 'BOE/XUDLGBD'

        currency_data = quandl.get(
            currency_code,
            collapse=self.frequency,
            start_date=self.start_date,
            transformation='normalize')

        return context
