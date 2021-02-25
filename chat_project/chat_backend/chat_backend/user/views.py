from django.shortcuts import render, HttpResponse
from rest_framework.views import APIView
import redis_server
import redis
import json
from .models import User


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


def disconnected(request):
    if request.method == 'POST':
        print("ㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜ,")
        data = request.body.decode('utf-8')
        peer_id = json.loads(data)['peer_id']
        room_id = json.loads(data)['room_id']

        disconnected_user = User.objects.filter(
            room_id=room_id).get(peer_id=peer_id)

        print("연결끊은유저: ", disconnected_user)
        disconnected_user.room_id = 0
        disconnected_user.room_uuid = "NULL"
        disconnected_user.peer_id = "default"
        disconnected_user.save()

        return HttpResponse("잘되써")
    else:
        return HttpResponse("POST로 오지 않음")
