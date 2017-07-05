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
            index = quandl.get(
                commodity['code'],
                collapse=self.frequency,
                start_date=self.start_date,
                transformation='normalize')

            # Allows straightforward multiplication for composite
            index['Value'] = index['Value'] / 100

            # TODO: Return indices adjusted for target currencies
            price_indices[commodity['display']] = {
                'usd': index['Value'].tolist()
            }
            price_indices[commodity['display']]['usd'].insert(0, commodity['display'])

        # TODO: Check that all commodities return the same date values
        index.reset_index(inplace=True)
        index['Date'] = index['Date'].dt.strftime('%Y-%m-%d')
        dates = index['Date'].tolist()
        dates.insert(0, 'date')

        context.update({
            'commodities': commodities,
            'dates': dates,
            'price_indices': price_indices,
        })

        return context
