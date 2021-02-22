from django.db import models


class Room(models.Model):
    number = models.IntegerField(("방번호"))
    name = models.CharField(("방이름"), max_length=100, null=True, default="NULL")
    password = models.CharField(
        ("방 비밀번호"), max_length=100, null=True, default="NULL")
    is_private = models.BooleanField(("잠금상태"), default=False)
    status = models.CharField(
        ("방 상태"), max_length=30, null=True, default="IDLE")
    uuid = models.CharField(
        ("방 uuid"), max_length=254, null=True, default="NULL")

    class Meta:
        ordering = ['number']

# Room Serializer
