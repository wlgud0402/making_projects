from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


# class UserManager(BaseUserManager):
#     def create_user(self, email, password):
#         if not email:
#             raise ValueError('Users must have an email address')

#         user = self.model(
#             email=self.normalize_email(email),
#             password=password,
#         )

#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password):
#         user = self.create_user(
#             email,
#             password=password,
#         )
#         user.is_admin = True
#         user.save(using=self._db)
#         return user


# class User(AbstractBaseUser):
#     email = models.EmailField("이메일", max_length=254, unique=True)
#     password = models.CharField("비밀번호", max_length=100)
#     is_active = models.BooleanField("이메일인증여부", default=False)
#     is_social = models.BooleanField("소셜인증여부", null=True)
#     is_admin = models.BooleanField("관리자여부", default=False)
#     created_at = models.DateTimeField("가입시간", auto_now_add=True)

#     objects = UserManager()

#     USERNAME_FIELD = 'email'


class User(models.Model):
    google_id = models.CharField(
        ("구글로그인 아이디"), max_length=254, null=True, default="default")
    email = models.EmailField(
        ("사용자 이메일"), max_length=254, null=True, default="default@naver.com")
    nickname = models.CharField(("닉네임"), max_length=50)
    peer_id = models.CharField(
        ("피어 id"), max_length=254, null=True, default="default")
    user_type = models.CharField(
        ("유저타입"), max_length=50, null=True, default="GUEST")
    room_id = models.IntegerField(("방번호"), null=True, default=0)
    room_uuid = models.CharField(
        ("방 uuid"), max_length=254, null=True, default="NULL")
    created_at = models.DateTimeField(("가입일"), auto_now_add=True)

    def __str__(self):
        return self.nickname

    class Meta:
        ordering = ['-user_type']
