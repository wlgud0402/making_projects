from django.urls import path
from .views import index, message, getMessage
from .api import RoomAPI, GetRoomAPI
from rest_framework import generics


urlpatterns = [
    path('', index, name='home'),
    path('message', message, name='message'),
    path('room/', RoomAPI.as_view(), name='room'),  # api/chat/room
    path('getroom/', GetRoomAPI.as_view(), name='get_room_by_uuid'),
    path('getmessage/', getMessage, name='get_message'),
]
