from django.conf import settings
from django.views.generic import TemplateView
import pandas as pd
import quandl

from recipe_builder.commodities import commodities
from recipe_builder.models import Commodity

quandl.ApiConfig.api_key = settings.QUANDL_API_KEY


class RecipeBuilder(TemplateView):
    template_name = 'recipe.html'
    frequency = 'monthly'

    # Explicitly set end date to the last day of the previous month: ensures
    # each commodity collapses to the same number of datapoints irrespective of
    # underlying data granularity (otherwise daily values include the current
    # month but monthly don't!)
    end_date = pd.to_datetime('now')
    end_date = end_date.replace(day=1)
    end_date = end_date - pd.DateOffset(days=1)

    start_date = end_date - pd.DateOffset(years=1)

    start_date = start_date.strftime('%Y-%m-%d')
    end_date = end_date.strftime('%Y-%m-%d')

    def get_context_data(self, **kwargs):
        context = super(RecipeBuilder, self).get_context_data(**kwargs)

        if 'start_date' in kwargs.keys():
            # Deliberately only add the date to the context if it has been
            # proactively set (trying to emphasise that this is optional)
            context['date'] = kwargs['start_date']
            self.start_date = '{}-01'.format(context['date'])

        currency_code = 'BOE/XUDLGBD'

        currency_data = quandl.get(
            currency_code,
            collapse=self.frequency,
            start_date=self.start_date,
            end_date=self.end_date,
            transformation='normalize')

        price_indices = {}

        commodites_metadata = Commodity.objects.all().values_list()
        dates = []

        # Grouped for display purposes, e.g. meat and fish
        for group in commodities:
            for commodity in group:
                dataset = quandl.get(
                    commodity['code'],
                    collapse=self.frequency,
                    start_date=self.start_date,
                    end_date=self.end_date,
                    transformation='normalize')

                metadata = commodites_metadata.get(commodity_code=commodity['code'])
                name = metadata[1]
                description = metadata[2]

                if description == 'This dataset has no description.':
                    description = name
                elif 'Data: IMF' in description:
                    # Both elements contain useful information; the description
                    # alone is rather dry and unhelpful
                    description = '{} - {}'.format(name, description)

                price_indices[commodity['display']] = {
                    # Returned column names are not consistent so use index
                    'usd': [commodity['display']] + dataset.iloc[:, 0].tolist(),
                    'description': description
                }

                index_name = dataset.index.name
                dataset.reset_index(inplace=True)
                dataset['Date'] = dataset[index_name].dt.strftime('%Y-%m-%d')

                commodity_dates = ['date'] + dataset['Date'].tolist()

                # If dates not yet set or previous datasets were missing dates,
                # take the new, longer list of dates
                if not dates or len(commodity_dates) > len(dates):
                    dates = commodity_dates

        context.update({
            'commodities': commodities,
            'dates': dates,
            'price_indices': price_indices,
        })

        return context
