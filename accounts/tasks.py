from celery import shared_task
from time import sleep
from notifications.models import *
from django.db.models import Q
from datetime import datetime, timedelta

@shared_task()
def sleepy(duration):
    sleep(duration)
    name = 'run sleepy task.....'
    return name

@shared_task()
def deleteNotifications():
    notify = Notification.objects.filter(
        Q(seen=True) & Q(timeStamp__lte=datetime.now() - timedelta(days=7))
    ).all()

    if notify:
        notify.delete()
        return 'notification delete...............'

    else:
        return 'no notifications.................'

