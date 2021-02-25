from django.shortcuts import render, HttpResponse
from rest_framework.views import APIView
import redis_server
import redis
import json


def index(request):
    return HttpResponse("유저앱의 기본 index주소")


def hello(reqeust):
    print(reqeust.POST)
    return HttpResponse("헬로하고 인사해자")


def getMessage(request):
    if request.method == 'POST':
        print("메세지 받았어ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ")
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)['message']
        roomId = json.loads(body_unicode)['roomId']
        nickname = json.loads(body_unicode)['nickname']

        r = redis.Redis(host='localhost', port=6379, db=0)

        r.publish('my-chat', json.dumps({
            'roomId': roomId,
            "nickname": nickname,
            "msg": data,
        }))

        return HttpResponse("잘되써")
    else:
        return HttpResponse("POST로 오지 않음")
