from django.urls import path
from .views import index

urlpatterns = [
    path('', index),
    path('RoomJoinPage/', index),
    path('RoomCreatePage/', index),
    path('room/<str:roomCode>', index),
]



