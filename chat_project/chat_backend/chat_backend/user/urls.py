from django.urls import path
from .views import index, hello
from .api import UserAPI, UserPeerAPI, GuestUserAPI, GetUserPeerAPI, ChangeUserNicknameAPI
from rest_framework import generics
from .views import getMessage, disconnected


urlpatterns = [
    # path('', index, name=''),
    path('', UserAPI.as_view(), name='user'),
    path('peer/', UserPeerAPI.as_view(), name='user_peer'),
    path('peerbyroom/<int:pk>', GetUserPeerAPI.as_view(), name='user_peer'),
    path('peer/guest', GuestUserAPI.as_view(), name='guest_user'),
    path('hello/', hello, name='hello'),
    path('getMessage/', getMessage, name='getMessage'),
    path('disconnected/', disconnected, name='disconnected'),
    path('changeUserNickname/', ChangeUserNicknameAPI.as_view(),
         name='changeUserNickname'),
]
