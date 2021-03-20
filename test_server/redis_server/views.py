from django.shortcuts import render, HttpResponse


def home(request):
    return HttpResponse("홈으로 잘왔꾼요1!")


def message(request):
    if request.method == 'POST':
        return HttpResponse("잘되써")
    else:
        return HttpResponse("heello")
