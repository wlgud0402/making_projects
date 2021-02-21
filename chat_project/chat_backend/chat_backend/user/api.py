from rest_framework.views import APIView
from .models import User
from .serializers import UserSerializer
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
