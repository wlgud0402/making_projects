from django.urls import path
from .views import index, message

urlpatterns = [
    path('', index, name='home'),
    path('message', message, name='message'),
]
