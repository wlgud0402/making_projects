from django.shortcuts import render, HttpResponse

# Create your views here.


def index(request):
    return HttpResponse("유저앱의 기본 index주소")
