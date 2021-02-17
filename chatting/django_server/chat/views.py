from django.shortcuts import render, HttpResponse

import redis_server
import redis
import json

# Python 3.0 ~ Python 3.5.x에서는 json.loads()유니 코드 문자열 만 허용하므로
# request.body전달하기 전에 디코딩(바이트 문자열)해야합니다 json.loads().


def getMessage(request):
    if request.method == 'POST':
        print("메세지 받았어ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ")
        body_unicode = request.body.decode('utf-8')
        data = json.loads(body_unicode)['message']
        print(data)
        return HttpResponse("잘되써")
    else:
        return HttpResponse("POST로 오지 않음")
