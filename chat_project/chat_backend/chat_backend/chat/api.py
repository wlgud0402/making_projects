from rest_framework.views import APIView
from .models import Room
from .serializers import RoomSerializer, GetRoomSerializer
from django.http import JsonResponse
from rest_framework.response import Response
import jwt
from rest_framework import status
import redis
import redis_server
import json


#     def get_object(self, pk):
#         try:
#             return Snippet.objects.get(pk=pk)
#         except Snippet.DoesNotExist:
#             raise Http404

#     def get(self, request, pk, format=None):
#         snippet = self.get_object(pk)
#         serializer = SnippetSerializer(snippet)
#         return Response(serializer.data)

#     def put(self, request, pk, format=None):
#         snippet = self.get_object(pk)
#         serializer = SnippetSerializer(snippet, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class UserAPI(APIView):
#     def post(self, request, format=None):
#         # user get_or_create
#         user, created = User.objects.get_or_create(
#             google_id=request.data['google_id'],
#             email=request.data['email'],
#             nickname=request.data['nickname'],
#             user_type=request.data['user_type'])

#         # jwt token response
#         user_token = jwt.encode(
#             {'user_id': user.id, 'email': user.email,
#                 'nickname': user.nickname, 'user_type': user.user_type},
#             "secret", algorithm="HS256")
#         return JsonResponse({
#             'user_token': user_token
#         })

#     elif request.method == 'PUT':
#         tutorial_data = JSONParser().parse(request)
#         tutorial_serializer = TutorialSerializer(tutorial, data=tutorial_data)
#         if tutorial_serializer.is_valid():
#             tutorial_serializer.save()
#             return JsonResponse(tutorial_serializer.data)
#         return JsonResponse(tutorial_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RoomAPI(APIView):
    def get(self, request):
        if request.query_params.get('id'):
            id = request.query_params.get('id')
            room = Room.objects.get(id=id)

            if room.is_private:
                return JsonResponse({"is_private": room.is_private})
            else:
                return JsonResponse({'uuid': room.uuid})

        # query로 받은 id가 없을경우 모든 room을 가져온다.
        serializer = GetRoomSerializer(Room.objects.all(), many=True)
        return Response(serializer.data)

    # 방만들기
    def put(self, request, format=None):
        number = request.data['number']
        uuid = request.data['uuid']
        room = Room.objects.get(id=number)
        room_serializer = RoomSerializer(room, data=request.data)

        if room_serializer.is_valid():
            room_serializer.save()

            r = redis.Redis(host='localhost', port=6379, db=0)
            r.publish('room-refresh', json.dumps({
                'room_id': request.data['number'],
            }))

            return JsonResponse({"room_uuid": uuid})
        return JsonResponse(room_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # 방에 들어가기 => 비밀번호가 있다면 입력해야지!
    def post(self, request):
        if request.data.get('password'):
            user_sent_password = request.data.get('password')
            id = request.data['id']
            room = Room.objects.get(id=id)
            room_password = room.password

            if user_sent_password == room_password:
                return JsonResponse({'uuid': room.uuid})
            else:
                return JsonResponse({"msg": "비밀번호가 잘못되었습니다."})
        else:
            return JsonResponse({"msg": "잘못된 요청입니다."})


class GetRoomAPI(APIView):
    def get(self, request):
        if request.query_params.get('uuid'):
            room_uuid = request.query_params.get('uuid')
            try:
                room = Room.objects.get(uuid=room_uuid)
                return JsonResponse({"room_id": room.id, "room_name": room.name})
            except:
                return JsonResponse({"msg": "there is no room"})
        return JsonResponse({'msg': "there is no uuid"})


class RoomPasswordAPI(APIView):
    def post(self, request):
        room_id = request.data['room_id']
        room_password = request.data['room_password']
        room = Room.objects.get(id=room_id)
        room.password = room_password
        room.is_private = True
        room.save()
        return JsonResponse({"msg": "비밀번호가 설정되었습니다."})

    # 비밀번호 없애기
    def put(self, request):
        room_id = request.data['room_id']
        room = Room.objects.get(id=room_id)
        room.password = "NULL"
        room.is_private = False
        room.save()
        return JsonResponse({"msg": "비밀번호가 해제되었습니다."})
