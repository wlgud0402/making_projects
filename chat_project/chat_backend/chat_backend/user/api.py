from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer
from django.shortcuts import render, HttpResponse
from rest_framework.response import Response


class UserAPI(APIView):
    # if like_serializer.is_valid():
    #     post = Post.objects.get(id=request.data['post_id'])
    #     user = User.objects.get(id=request.data['user_id'])

    def post(self, request, format=None):
        print("데이터", request.data['google_id'])
        user, created = User.objects.get_or_create(
            google_id=request.data['google_id'])

        created_user = User.objects.get(google_id=request.data['google_id'])
        return Response(created_user)
        # user_serializer = UserSerializer(data=request.data['google_id'])
        # if user_serializer.is_valid():
        #     print("데이터가 시리얼라이즈에 잘 맞았어!")
        # else:
        #     print("시리얼라이즈에 안맞네 시발거")
        # print("ㅡㅜㅡㅜㅜㅜㅜㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ포스트요청받음")
        # print("request", request)
        # user, created = User.objects.get_or_create(
        #     google_id=request['google_id'])
        # print(user, created)

        # return HttpResponse("어쩌라고")
