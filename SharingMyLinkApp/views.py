from channels.layers import get_channel_layer
from django.shortcuts import render
from rest_framework import generics, status
from .models import * 
from .serializers import RoomSerializers
from rest_framework.views import APIView
from rest_framework.response import Response
import random
import string
from django.views.decorators.csrf import csrf_exempt
from asgiref.sync import async_to_sync




# Create your views here.

def generate_unique_code():
    length = 6

    # while True:
    code = ''.join(random.choices(string.ascii_uppercase, k=length))
        # if Room.objects.filter(code=code).count==0:
        #     break

    return code


def send_channel_message(group_name, type_of_message, message):

    group_name = 'room_%s' % group_name
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(group_name, 
    {
        "type": type_of_message,
        'message': message
    })

class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializers

class GetRoom(APIView):
    serializer_class = RoomSerializers
    lookup_url_kwarg = 'code'


    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializers(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK) 
            return Response({'Room Not Found' : 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)  

        return Response({'Bad Request' : 'Code Parametre NOT FOUND in Request'}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):

    serializer_class = RoomSerializers

    # @csrf_exempt
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        host = self.request.session.session_key
        queryset = Room.objects.filter(host=host)
        print(queryset, host)
        if queryset:
            room = queryset[0]
            print("if")
            self.request.session['room_code'] = room.code
            return Response(RoomSerializers(room).data, status=status.HTTP_200_OK)
        else:
            print("WORKS THIS")
            random_code = generate_unique_code()
            room = Room.objects.create(host=host, code = random_code)
            print(room)
            room.save()
            print("else\n", room.__dict__)
            self.request.session['room_code'] = room.code
            return Response(RoomSerializers(room).data, status=status.HTTP_201_CREATED)

        #return Response("Works POST")


class UploadFile(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)


        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        host = self.request.session.session_key
        queryset = Room.objects.filter(code=code)

        if code!= None:

            if queryset.exists():
                room = queryset[0]
                received_file = request.FILES['file']

                fileEntry = File(room=room, roomFile=received_file)
                fileEntry.save()
                send_channel_message(room.code, "file", fileEntry.roomFile.url)
                return Response({'Success': 'File was Accepted'}, status=status.HTTP_200_OK)
            else:
                return Response({'Room Not Found' : 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)
                
        else:
            return Response({'Bad Request': 'Invalid post data'}, status=status.HTTP_400_BAD_REQUEST)
        

class GetFile(APIView):
    lookup_url_kwarg = 'code'
    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)

        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        host = self.request.session.session_key
        queryset = Room.objects.filter(code=code)
        # print(queryset, host)
        if code!= None:


            if queryset.exists():
                room = queryset[0]
                
                files = File.objects.filter(room=room)
                # for file in files:
                #     print(file.roomFile.url)
                # return Response({'Success': 'File URLs were sent'}, status=status.HTTP_200_OK)        

                data = []
                if files.exists():
                    for x in range(len(files)):
                        data.append(files[x].roomFile.url)

                    # return Response({"files": data}, status = status.HTTP_200_OK)

                return Response({"files": data}, status = status.HTTP_200_OK)  
            else:
                # print(len(queryset))
                # return Response({'Bad Request': 'Invalid post data'}, status=status.HTTP_400_BAD_REQUEST)
                return Response({'Room Not Found' : 'Invalid Room Code'}, status=status.HTTP_404_NOT_FOUND)  
        else:
            return Response({'Bad Request': 'Invalid post data'}, status=status.HTTP_400_BAD_REQUEST)


class DestroyRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        host = self.request.session.session_key
        queryset = Room.objects.filter(host=host)

        if queryset.exists():
            room = queryset[0]
            send_channel_message(room.code, "room_destroyed", 'Room is no more')
            room.delete()
            return Response({"Good Job": "Finally done!!"}, status=status.HTTP_200_OK)
        else:
            return Response({'Bad Request': 'Invalid post data'}, status=status.HTTP_400_BAD_REQUEST)