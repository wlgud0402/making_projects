import redis
import redis_server
import json
from django.shortcuts import render, HttpResponse
from .models import Room


def index(request):
    if request.method == 'POST':
        body = request.body.decode('utf-8')
        data = json.loads(body)['data']
        print("Got POST Request!!!!", data)
    return HttpResponse("api요청 잘받았네요")


def message(message):
    return HttpResponse("메시지 받아오는곳 api/chat/message")


def getMessage(request):
    if request.method == 'POST':
        data = request.body.decode('utf-8')
        message = json.loads(data)['message']
        nickname = json.loads(data)['nickname']
        room_id = json.loads(data)['room_id']
        peer_id = json.loads(data)['peer_id']
        print("메세지를 제출받아서 가공하고 메시지, 닉네임, 방번호를 전달합니다.",
              message, nickname, room_id)

        r = redis.Redis(host='localhost', port=6379, db=0)

        r.publish('my-chat', json.dumps({
            'room_id': room_id,
            "nickname": nickname,
            "message": message,
            "peer_id": peer_id
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
        print(peer_id, room_id)

        return HttpResponse("잘되써")
    else:
        return HttpResponse("POST로 오지 않음")
