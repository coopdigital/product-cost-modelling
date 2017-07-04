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

        currency_code = 'BOE/XUDLGBD'

        currency_data = quandl.get(
            currency_code,
            collapse=self.frequency,
            start_date=self.start_date,
            transformation='normalize')

        commodities = [{
            'display': 'Wheat',
            'code': 'COM/WHEAT_MN',
        }, {
            'display': 'Corn',
            'code': 'COM/CORN_2',
        }]

        price_indices = {}

        for commodity in commodities:
            prices = quandl.get(
                commodity['code'],
                collapse=self.frequency,
                start_date=self.start_date,
                transformation='normalize')

            price_indices[commodity['display']] = prices['Value'].tolist()
            price_indices[commodity['display']].insert(0, commodity['display'])

        # TODO: Check that all commodities return the same date values
        prices.reset_index(inplace=True)
        prices['Date'] = prices['Date'].dt.strftime('%Y-%m-%d')
        dates = prices['Date'].tolist()
        dates.insert(0, 'date')

        context.update({
            'dates': dates,
            'price_indices': price_indices,
        })

        return context
