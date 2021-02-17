from django.urls import path
from .views import getMessage

urlpatterns = [
    path('', getMessage, name='getMessage'),
]
