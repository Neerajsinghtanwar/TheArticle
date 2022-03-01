from celery import shared_task
from time import sleep
from notifications.models import *
from django.db.models import Q
from datetime import datetime, timedelta
from blog.models import *
from django.core.mail import EmailMultiAlternatives

@shared_task()
def send_mail_task(*args, **kwargs):
    subject = kwargs['subject']
    message = kwargs['message']
    str_template = kwargs['str_template']
    email_from = kwargs['email_from']
    recipient_list = kwargs['recipient_list']

    email = EmailMultiAlternatives(
        subject,
        message,
        email_from,
        recipient_list
    )

    email.attach_alternative(str_template, "text/html")
    email.send()

    return args

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

