from django.urls import path
from .views import index, message, getMessage, changeroomstatus
from .api import RoomAPI, GetRoomAPI, RoomPasswordAPI
from rest_framework import generics


urlpatterns = [
    path('', index, name='home'),
    path('message', message, name='message'),
    path('room/', RoomAPI.as_view(), name='room'),  # api/chat/room
    path('getroom/', GetRoomAPI.as_view(), name='get_room_by_uuid'),
    path('getmessage/', getMessage, name='get_message'),
    # path('disconnected/', disconnected, name='get_message'),
    path('changeroomstatus/', changeroomstatus, name='change_room_status'),
    path('roompassword/', RoomPasswordAPI.as_view(), name='roompassword'),
]
