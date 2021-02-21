from django.urls import path
from .views import index, message
from .api import RoomAPI
from rest_framework import generics


urlpatterns = [
    path('', index, name='home'),
    path('message', message, name='message'),
    path('room/', RoomAPI.as_view(), name='room'),  # api/chat/room
]
