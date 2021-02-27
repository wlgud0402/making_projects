from django.shortcuts import render, HttpResponse
from rest_framework.views import APIView
import redis_server
import redis
import json
from .models import User
from chat.models import Room
from .scheduler import roomScheduler
from rest_framework import status
from rest_framework.response import Response


def status_response(self):
    content = {'msg': 'process is working'}
    return Response(content, status=status.HTTP_200_OK)


def index(request):
    print(roomScheduler)
    return HttpResponse("유저앱의 기본 index주소")


def hello(reqeust):
    print(roomScheduler)
    # print(reqeust.POST)
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
    content = {'msg': 'process is working'}
    if request.method == 'POST':
        try:
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

            room = Room.objects.get(id=room_id)
            room_user_count = User.objects.filter(room_id=room_id).count()
            print("방안에 남아있는 유저의 수 ", room_user_count)
            if room_user_count <= 0:
                room.status = "CLEANING"

                # 방안에 유저가 한명도 없다면 방상태를 CLEANING으로 바꿔주고 room-refresh실행
                r = redis.Redis(host='localhost', port=6379, db=0)
                r.publish('room-refresh', json.dumps({
                    'room_id': room_id,
                }))

                roomScheduler.scheduleRemove(room_id)

            return HttpResponse()
        except:
            print("무슨에러인지나 보자:")
            return HttpResponse()
    else:
        return HttpResponse()
