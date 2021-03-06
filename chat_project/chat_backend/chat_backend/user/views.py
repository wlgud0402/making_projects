from django.shortcuts import render, HttpResponse
from rest_framework.views import APIView
import redis_server
import redis
import json
from .models import User
from chat.models import Room
# from .scheduler import roomScheduler
from util.scheduler import roomScheduler
from rest_framework import status
from rest_framework.response import Response


def status_response(self):
    content = {'msg': 'process is working'}
    return Response(content, status=status.HTTP_200_OK)


def index(request):
    return HttpResponse("유저앱의 기본 index주소")


def hello(reqeust):
    return HttpResponse("헬로하고 인사해자")


def getMessage(request):
    if request.method == 'POST':
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)['message']
        room_id = json.loads(body_unicode)['room_id']
        nickname = json.loads(body_unicode)['nickname']

        r = redis.Redis(host='localhost', port=6379, db=0)

        r.publish('my-chat', json.dumps({
            'room_id': room_id,
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
            data = request.body.decode('utf-8')
            peer_id = json.loads(data)['peer_id']
            room_id = json.loads(data)['room_id']
            disconnected_user = User.objects.filter(
                room_id=room_id).get(peer_id=peer_id)

            disconnected_user.room_id = 0
            disconnected_user.room_uuid = "NULL"
            disconnected_user.peer_id = "default"
            disconnected_user.save()

            room = Room.objects.get(id=room_id)
            room_user_count = User.objects.filter(room_id=room_id).count()
            if room_user_count <= 0:
                room.status = "CLEANING"
                room.save()

                # 방안에 유저가 한명도 없다면 방상태를 CLEANING으로 바꿔주고 room-refresh실행
                r = redis.Redis(host='localhost', port=6379, db=0)
                r.publish('room-refresh', json.dumps({
                    'room_id': json.loads(data)['room_id'],
                }))

                roomScheduler.scheduleRemove(json.loads(data)['room_id'])

            return HttpResponse()
        except:
            return HttpResponse()
    else:
        return HttpResponse()
