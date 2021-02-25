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
        data = request.body.decode('utf-8')
        message = json.loads(data)['message']
        nickname = json.loads(data)['nickname']
        room_id = json.loads(data)['room_id']
        print(message, nickname, room_id)

        r = redis.Redis(host='localhost', port=6379, db=0)

        r.publish('my-chat', json.dumps({
            'room_id': room_id,
            "nickname": nickname,
            "message": message,
        }))

        return HttpResponse("잘되써")
    else:
        return HttpResponse("POST로 오지 않음")
