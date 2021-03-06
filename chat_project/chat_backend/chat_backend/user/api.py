from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, UserPeerSerializer
from django.http import JsonResponse
import jwt
import redis
import redis_server
import json

# return Response({
#     "user": UserSerializer(user, context=self.get_serializer_context()).data,
#     "token": AuthToken.objects.create(user)[1]
# })

# encoded_jwt = jwt.encode({"some": "payload"}, "secret", algorithm="HS256")


class UserAPI(APIView):
    def post(self, request, format=None):
        # user get_or_create
        user, created = User.objects.get_or_create(
            google_id=request.data['google_id'],
            email=request.data['email'],
            nickname=request.data['nickname'],
            user_type=request.data['user_type'])

        # jwt token response
        user_token = jwt.encode(
            {'user_id': user.id, 'email': user.email,
                'nickname': user.nickname, 'user_type': user.user_type},
            "secret", algorithm="HS256")
        return JsonResponse({
            'user_token': user_token
        })

    def get(self, request):
        # 다른사람 peer id를통해 받는정보 다른사람의 정보를 가져오기 위함\
        # nickname, usertype
        if request.query_params.get('peer_id'):
            peer_id = request.query_params.get('peer_id')
            user = User.objects.get(peer_id=peer_id)
            return JsonResponse({"nickname": user.nickname,
                                 "user_type": user.user_type})

        if request.query_params.get('user_id'):
            user_id = request.query_params.get('user_id')
            user = User.objects.get(id=user_id)
            return JsonResponse({'peer_id': user.peer_id})
        else:
            return JsonResponse({'msg': "query_params 없이 get요청"})


class GuestUserAPI(APIView):
    def post(self, request, format=None):
        # guest get_or_create
        guest, created = User.objects.get_or_create(
            nickname=request.data['nickname'],
            user_type="GUEST",
            peer_id=request.data['peer_id'],
            room_id=request.data['room_id'],
            room_uuid=request.data['room_uuid'],
        )

        r = redis.Redis(host='localhost', port=6379, db=0)
        r.publish('room-refresh', json.dumps({
            'room_id': request.data['room_id'],
        }))

        # JWT TOKEN RESPONSE
        guest_token = jwt.encode(
            {'user_id': guest.id,
             'nickname': guest.nickname,
             'user_type': guest.user_type},
            "secret", algorithm="HS256")
        return JsonResponse({'user_token': guest_token})


# 유저가 방에 입장
class UserPeerAPI(APIView):
    def post(self, request, format=None):
        user_id = request.data['user_id']
        peer_id = request.data['peer_id']
        room_id = request.data['room_id']
        room_uuid = request.data['room_uuid']

        r = redis.Redis(host='localhost', port=6379, db=0)
        r.publish('room-refresh', json.dumps({
            'room_id': request.data['room_id'],
        }))

        user = User.objects.get(id=user_id)
        user.peer_id = peer_id
        user.room_id = room_id
        user.room_uuid = room_uuid

        user.save()
        return JsonResponse({"H": "H"})


class GetUserPeerAPI(APIView):
    def get(self, request, pk):
        room_id = pk
        all_peer_ids = User.objects.filter(room_id=room_id).values('peer_id')
        serializer = UserPeerSerializer(all_peer_ids, many=True)
        return JsonResponse({"all_peer_ids": serializer.data})


# 나머지 기능들
class ChangeUserNicknameAPI(APIView):
    def put(self, request):
        user_id = request.data['user_id']
        new_nickname = request.data['new_nickname']

        user = User.objects.get(id=user_id)
        user.nickname = new_nickname
        user.save()

        new_user_token = jwt.encode(
            {'user_id': user.id, 'email': user.email,
                'nickname': user.nickname, 'user_type': user.user_type},
            "secret", algorithm="HS256")

        return JsonResponse({
            'user_token': new_user_token
        })
