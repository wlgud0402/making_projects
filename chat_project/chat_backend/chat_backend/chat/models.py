from django.db import models
# from django_mysql.models import ListTextField


# class Room(models.Model):
#     room_name = models.CharField("방 이름", max_length=100, default="room_name")
#     room_uuid = models.CharField(
#         "방 고유 아이디", max_length=100, default="room_uuid")
#     # room_users = ListTextField(
#     #     base_field=models.IntegerField("유저 integer_id"), size=7)
#     is_active = models.BooleanField(default=True)

#     def __str__(self):
#         return "방: " + self.room_name


# class Guest(models.Model):
#     nickname = models.CharField("게스트 이름", max_length=50, default="nickname")
#     room_uuid = models.CharField(
#         "방 고유 아이디", max_length=100, default="room_uuid")
#     user_uuid = models.CharField(
#         "게스트 고유 아이디", max_length=100, default="user_uuid")
#     is_active = models.BooleanField(default=True)

#     def __str__(self):
#         return "게스트: " + self.nickname
