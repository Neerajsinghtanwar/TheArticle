from channels.generic.websocket import AsyncJsonWebsocketConsumer, JsonWebsocketConsumer
from channels.generic.websocket import WebsocketConsumer
from channels.consumer import SyncConsumer
from channels.exceptions import StopConsumer
from .models import *
from channels.db import database_sync_to_async

class MyNotifications(AsyncJsonWebsocketConsumer):
    async def connect(self):
        print('WebSocket Connected...')
        await self.accept()
        self.group = self.scope['url_route']['kwargs']['group_name']
        # print('Group Name...', self.group)

        await self.channel_layer.group_add(
            self.group,
            self.channel_name
        )

    async def receive_json(self, content, **kwargs):
        print('Message Recieved...', content['msg'])
        # await self.channel_layer.group_send(
        #     self.group,
        #     {
        #         'type': 'chat.message',
        #         # 'message': content['msg']
        #     }
        # )

    async def chat_message(self, event):
        print('Event...', event['message'])
        await self.send_json({
            'msg': event['message']
        })
        # await self.close()

    async def disconnect(self, close_code):
        print('Websocket disconnect...', close_code)
        raise StopConsumer()
