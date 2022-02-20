from rest_framework import serializers
from .models import Notification
from django.db.models import Q
from datetime import datetime

class NotificationSeraializers(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username')
    quantity = serializers.SerializerMethodField('get_quantity')
    time_stamp = serializers.SerializerMethodField('get_timeStamp')

    class Meta:
        model = Notification
        fields = '__all__'

    def get_username(self, notify_obj):
        username = notify_obj.created_by.user.username
        return username

    def get_quantity(self, notify_obj):
        quantity = Notification.objects.filter(
            Q(user=notify_obj.user) & Q(seen=False)
        ).all()
        return len(quantity)

    def get_timeStamp(self, notify_obj):
        data = notify_obj.timeStamp

        date = datetime.now().date() - data.date()
        hour = datetime.now().time().hour - data.time().hour
        min = datetime.now().time().minute - data.time().minute
        sec = datetime.now() - data

        if data.date() < datetime.now().date():
            if date.days>=31:
                data = data.strftime('%a, %b %dth %Y')
            else:
                data = str(date.days) + ' days ago' if date.days>1 else str(date.days) + ' day ago'
        else:
            if sec.seconds>3600:
                data = str(hour)+' hours ago' if hour>1 else str(hour)+' hour ago'

            if sec.seconds>60 and sec.seconds<3600:
                data = str(min)+' minutes ago' if sec.seconds>60 else str(hour)+' minute ago'

            if sec.seconds<=60:
                data = str(sec.seconds)+' seconds ago' if sec.seconds>1 else str(hour)+' second ago'

        return data
