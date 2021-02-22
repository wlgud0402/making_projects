from django.urls import path
from .views import index, hello
from .api import UserAPI, UserPeerAPI
from rest_framework import generics


urlpatterns = [
    # path('', index, name=''),
    path('', UserAPI.as_view(), name='user'),
    path('peer/', UserPeerAPI.as_view(), name='user_peer'),
    path('hello/', hello, name='hello'),
]
