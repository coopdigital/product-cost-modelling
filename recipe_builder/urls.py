from django.conf.urls import url

from . import views


app_name = 'recipe_builder'

urlpatterns = [
    url(r'^$', views.RecipeBuilder.as_view(), name='recipe_builder'),
]
