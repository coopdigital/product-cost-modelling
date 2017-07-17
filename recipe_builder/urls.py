from django.conf.urls import url

from . import views


app_name = 'recipe_builder'

urlpatterns = [
    url(r'^$',
        views.RecipeBuilder.as_view(),
        name='recipe_builder'),
    url(r'^(?P<start_date>[0-9]{4}-[0-9]{2})',
        views.RecipeBuilder.as_view(),
        name='recipe_builder_with_start_specified'),
]
