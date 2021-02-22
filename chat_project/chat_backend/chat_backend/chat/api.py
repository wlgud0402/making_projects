from rest_framework.views import APIView
from .models import Room
from .serializers import RoomSerializer, GetRoomSerializer
from django.http import JsonResponse
from rest_framework.response import Response
import jwt
from rest_framework import status


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

    def put(self, request, format=None):
        number = request.data['number']
        uuid = request.data['uuid']
        print(uuid)
        room = Room.objects.get(id=number)
        room_serializer = RoomSerializer(room, data=request.data)

        if room_serializer.is_valid():
            room_serializer.save()
            return JsonResponse({"room_uuid": uuid})
        return JsonResponse(room_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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


class GetRoomAPI(APIView):
    def get(self, request):
        if request.query_params.get('uuid'):
            room_uuid = request.query_params.get('uuid')
            room = Room.objects.get(uuid=room_uuid)
            return JsonResponse({"room_id": room.id})
        return JsonResponse({'msg': "there is no uuid"})

    # serializer = PostSerializer(data=request.data)
    # if serializer.is_valid():
    #   	serializer.save()
    #     return Response(serializer.data, status=201)
    # return Response(serializer.errors, status=400)

    #     serializer_class = LikeSerializer
    # queryset = Like.objects.all()
    # permission_classes = [
    #     permissions.IsAuthenticated
    # ]

    # def get_queryset(self):
    #     queryset = self.queryset
    #     query = self.request.query_params.get('user_id', None)
    #     if query:
    #         queryset = queryset.filter(user_id=query)
    #         return queryset
    #     return queryset

    # def get(self, request,  **kwargs):
    #     room_list = Room.objects.all()
    #     # user_id = kwargs.get('user_id')
    #     return Response(room_list)

    # def get(self, request, **kwargs):
    #     # user get_or_create
    #     user, created = User.objects.get_or_create(
    #         google_id=request.data['google_id'],
    #         email=request.data['email'],
    #         nickname=request.data['nickname'],
    #         user_type=request.data['user_type'])

    #     # jwt token response
    #     user_token = jwt.encode(
    #         {'user_id': user.id, 'email': user.email,
    #             'nickname': user.nickname, 'user_type': user.user_type},
    #         "secret", algorithm="HS256")
    #     return JsonResponse({
    #         'user_token': user_token
    #     })
