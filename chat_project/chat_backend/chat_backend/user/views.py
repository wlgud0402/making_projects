from django.shortcuts import render, HttpResponse
from rest_framework.views import APIView

# Create your views here.


def index(request):
    return HttpResponse("유저앱의 기본 index주소")


def hello(reqeust):
    print(reqeust.POST)
    return HttpResponse("헬로하고 인사해자")

# def education_view(request):
#     if request.method == "POST":
#         uedu, created = UserEducation.objects.get_or_create(user=request.user)
#         uedu.university_name = request.POST['university_name']
#         uedu.save()
#         return HttpResponse("success")
