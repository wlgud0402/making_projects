from django.db import models
from rest_framework import serializers
from .models import Room


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('number', 'name', 'status',
                  'is_private', 'password',)
        write_only_fields = ('password',)


class MakeRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('number', 'name', 'status',
                  'is_private', 'uuid', 'password',)
