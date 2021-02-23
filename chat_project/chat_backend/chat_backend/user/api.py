from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer, UserPeerSerializer
from django.http import JsonResponse
import jwt

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

        # JWT TOKEN RESPONSE
        guest_token = jwt.encode(
            {'user_id': guest.id,
             'nickname': guest.nickname,
             'user_type': guest.user_type},
            "secret", algorithm="HS256")
        return JsonResponse({'user_token': guest_token})


class UserPeerAPI(APIView):
    def post(self, request, format=None):
        print("새로운 피어아이디와 방정보를 저장하기 위해 있는곳이고 데이터 잘 받았니?")
        user_id = request.data['user_id']
        peer_id = request.data['peer_id']
        room_id = request.data['room_id']
        room_uuid = request.data['room_uuid']
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
