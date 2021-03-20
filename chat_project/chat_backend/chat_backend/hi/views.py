from django.shortcuts import render, HttpResponse
import json
# Create your views here.


def hi(request):
    body_unicode = request.body.decode('utf-8')
    data = json.loads(body_unicode)['data']
    print("버튼 눌러서 하이요청받음", data)
    return HttpResponse("하이 들어옴")
