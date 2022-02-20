from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializers import *
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http.response import JsonResponse
from django.db.models import Q

# Create your views here.
class NotificationAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user
        notify_obj = Notification.objects.filter(user=current_user).all().order_by('-timeStamp')
        quantity = Notification.objects.filter(
            Q(user=current_user) & Q(seen=False)
        ).all()
        context = dict()
        if notify_obj:
            context['notifications'] = NotificationSeraializers(notify_obj, many=True).data
            context['quantity'] = len(quantity)

        return JsonResponse(context)


def likeNotify(user, blogger, content, text, img):
    slug = str(blogger)+'-'+text+str(content)
    if not Notification.objects.filter(slug=slug).first():
        notify = Notification(
            user=user,
            created_by=blogger,
            content_object=content,
            text=text,
            image_url=img,
            slug=slug
        )
        notify.save()

    notify_obj = Notification.objects.filter(user=user).all().order_by('-timeStamp')

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        str(user),
        {
            'type': 'chat.message',
            'message': NotificationSeraializers(notify_obj, many=True).data
        }
    )

def commentNotify(user, blogger, content, text, msg, img):
    slug = str(blogger) + '-' + msg + str(content)
    if not Notification.objects.filter(slug=slug).first():
        notify = Notification(
            user=user,
            created_by=blogger,
            content_object=content,
            text=text,
            msg=msg,
            image_url=img,
            slug=slug
        )
        notify.save()

    notify_obj = Notification.objects.filter(user=user).all().order_by('-timeStamp')

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        str(user),
        {
            'type': 'chat.message',
            'message': NotificationSeraializers(notify_obj, many=True).data
        }
    )

class SeenAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_user = request.user
        slug = request.data.get('slug')
        notify_obj = Notification.objects.filter(slug=slug).first()

        notify_obj.seen = True
        notify_obj.save()

        notify_obj = Notification.objects.filter(user=current_user).all().order_by('-timeStamp')

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            str(current_user),
            {
                'type': 'chat.message',
                'message': NotificationSeraializers(notify_obj, many=True).data
            }
        )
        return JsonResponse({'success':True, 'msg':'seen successfully'})
