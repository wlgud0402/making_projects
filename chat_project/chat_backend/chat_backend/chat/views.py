import redis
import redis_server
import json
from django.shortcuts import render, HttpResponse


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
        print("메세지 받았어ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ")
        message = request.data['message']
        room_id = request.data['room_id']
        nickname = request.data['nickname']

        r = redis.Redis(host='localhost', port=6379, db=0)

        # select * from user where user.id = id;
        # roomId = user.roomId;

        r.publish('my-chat', json.dumps({
            'room_id': room_id,
            "nickname": nickname,
            "msg": message,
        }))

        return HttpResponse("잘되써")
    else:
        return HttpResponse("POST로 오지 않음")
