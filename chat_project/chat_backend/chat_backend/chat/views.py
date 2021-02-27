import redis
import redis_server
import json
from django.shortcuts import render, HttpResponse
from .models import Room


r = redis.Redis(host='localhost', port=6379, db=0)


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


# def disconnected(request):
#     if request.method == 'POST':
#         print("ㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜㅜ,")
#         data = request.body.decode('utf-8')
#         peer_id = json.loads(data)['peer_id']
#         room_id = json.loads(data)['room_id']
#         print(peer_id, room_id)

#         return HttpResponse("잘되써")
#     else:
#         return HttpResponse("POST로 오지 않음")


def changeroomstatus(request):
    if request.method == 'POST':
        print("리퀘스트 요청을 받았습니다. 방상태 변경시키기")
        data = request.body.decode('utf-8')
        room_id = json.loads(data)['room_id']
        room = Room.objects.get(id=room_id)
        print("룸아이디", room_id)

        if room.status == 'CLEANING':
            room.status = 'ACTIVE'
            room.save()

            # socket 서버에 퍼블리시를 통해 알려준다
            r = redis.Redis(host='localhost', port=6379, db=0)
            r.publish('room-refresh', json.dumps({
                'room_id': room_id,
            }))
            print("퍼블리시ㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣㅣ")
            # 클리닝 돌리고있는 스케쥴러 켄슬시킴
        return HttpResponse("잘되써")
    else:
        return HttpResponse("POST로 오지 않음")
