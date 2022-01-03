from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import *

class ConsumerRoom(AsyncWebsocketConsumer):

    async def connect(self):

        self.room_code = self.scope['url_route']['kwargs']['room_code']
        self.group_name = 'room_%s' % self.room_code
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def channel_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'channel_message',
                'message': message
            }
        )

    async def file(self, event):
        file = event['message']
        await self.send(text_data=json.dumps({
            'file': file
        }))

    async def room_destroyed(self, event):
        khatam = event['message']
        await self.send(text_data=json.dumps({
            'destroy': khatam
        }))

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )


    # async def file(self, event):
    #     file = event['message']
    #     await self.send(text_data=json.dumps({
    #         'file': 'file_added'   
    #     }))