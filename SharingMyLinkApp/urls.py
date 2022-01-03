#from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('home', RoomView.as_view()),
    path('get-room/', GetRoom.as_view()),
    path('create-room', CreateRoomView.as_view()),
    path('join-room', JoinRoom.as_view()),
    path('file-upload/', UploadFile.as_view()),
    path('file-fetch/', GetFile.as_view()),
    path('room-destroy/', DestroyRoom.as_view()),
]
