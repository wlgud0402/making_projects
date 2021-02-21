from django.contrib import admin
from .models import User

# Register your models here.
# admin.site.register(User)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'nickname', 'user_type', 'room_id', 'created_at',)
