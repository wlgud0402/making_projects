from django.shortcuts import render, HttpResponse


def home(request):
    return HttpResponse("홈으로 잘왔꾼요1!")


def message(request):
    if request.method == 'POST':
        print("메세지 받았어")
        print(request.POST)
        # message = request.POST['message']
        # print("message를 받았습니다:  ", message)
        return HttpResponse("잘되써")
    else:
        return HttpResponse("heello")
