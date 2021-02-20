from django.urls import path
from .views import index, hello
from .api import UserAPI
from rest_framework import generics


urlpatterns = [
    # path('', index, name=''),
    path('', UserAPI.as_view(), name='user'),
    path('hello/', hello, name='hello'),
]
