from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/chat/', include('chat.urls')),
    path('api/user/', include('user.urls')),
    path('hello', include('hi.urls')),
]
