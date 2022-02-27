import json
import logging

from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import  *
from .models import  *
from accounts.models import  *
from django.http import HttpResponse, JsonResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q, F, Value as V, Count
from django.db.models.functions import Concat
from notifications.views import *
from time import sleep
from accounts.tasks import *


# Create your views here.
class HomePageAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_user = request.user
        # sleepy.delay(5)
        catList  = []
        for i in vars(Categories):
            if '_' in i:
                continue
            else:
                catList.append(i)

        context = dict()
        if current_user:
            # user = Blogger.objects.filter(user__username=current_user).annotate(blockedUsers=Concat(F("block_users__username"), V(","), F("blocked_by_users__username"))).first().blockedUsers

            blockUsers = Blogger.objects.filter(user__username=current_user).values_list('block_users__username', flat=True)
            blockedByUsers = Blogger.objects.filter(user__username=current_user).values_list('blocked_by_users__username', flat=True)
            users = list(blockUsers)+list(blockedByUsers)

            queryset = Blog.objects.exclude(user__user__username__in=users).annotate(currentUser=V(str(current_user)), checkLike=Count('like', filter=Q(like__user__username__in=[current_user]))).all().order_by('-created_at')

            context['blog'] = BlogSerializer(queryset, many=True).data
            context['category'] = catList
            context['success'] = True

            return JsonResponse(context)

        return JsonResponse({'success': False, 'error': 'something went wrong.'})


    def post(self, request):
        current_user = request.user
        if current_user:
            cat = request.data.get('category').lower()
            context = dict()
            # user = Blogger.objects.filter(user__username=current_user).annotate(blockedUsers=Concat(F("block_users__username"), V(","), F("blocked_by_users__username"))).first().blockedUsers
            blockUsers = Blogger.objects.filter(user__username=current_user).values_list('block_users__username', flat=True)
            blockedByUsers = Blogger.objects.filter(user__username=current_user).values_list('blocked_by_users__username', flat=True)
            users = list(blockUsers)+list(blockedByUsers)

            queryset = Blog.objects.filter(category=cat).exclude(user__user__username__in=users).annotate(currentUser=V(str(current_user)), checkLike=Count('like', filter=Q(like__user__username__in=[current_user]))).all().order_by('-created_at')

            context['blog'] = BlogSerializer(queryset, many=True).data
            context['success'] = True

            return JsonResponse(context)

        return JsonResponse({'success': False, 'error': 'something went wrong.'})


class DashBoardAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, user_name):
        current_user = request.user

        user_obj = User.objects.filter(username=user_name).first()

        if user_obj == None:
            return JsonResponse({"success": False, "error": "user is not valid"})

        blogger_obj = Blogger.objects.filter(user=user_obj).all()
        blog_obj = Blog.objects.filter(user__user__username=user_name).annotate(currentUser=V(str(current_user)), checkLike=Count('like', filter=Q(like__user__username__in=[current_user]))).all().order_by('-created_at')

        followers_obj = Blogger.objects.get(user=user_obj).followers.all()
        followings_obj = Blogger.objects.get(user=user_obj).following.all()

        context = dict()

        if str(current_user) == user_name:
            context['current_user'] = str(current_user)

        if current_user in followers_obj:
            context['unfollow'] = True

        current_user_block_users = Blogger.objects.get(user=current_user).block_users.all()
        if user_obj in current_user_block_users:
            context['block'] = True

        context['blogger'] = BloggerSerializer(blogger_obj, many=True).data
        context['blog'] = BlogSerializer(blog_obj, many=True).data
        context['followers'] = FollowSerializer(followers_obj, many=True).data
        context['following'] = FollowSerializer(followings_obj, many=True).data

        return JsonResponse(context)


class BlogApi(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        catList = []
        for i in vars(Categories):
            if '_' in i:
                continue
            else:
                catList.append(i.lower())

        context = dict()
        context['category'] = catList
        return JsonResponse(context)

    def post(self, request):
        current_user = request.user

        if request.data.get('thumbnail') == 'null':
            thumbnail = 'images/thumbnail.jpeg'
        else:
            thumbnail = request.FILES['thumbnail']

        user_obj = User.objects.get(username=current_user)
        blogger = Blogger.objects.filter(user=user_obj).first()
        Blog.objects.create(
            user = blogger,
            title = request.data.get('title'),
            category = 'world' if request.data.get('category')=='null' else request.data.get('category'),
            description = request.data.get('description'),
            thumbnail = thumbnail,
            content = request.data.get('content'),
        )

        return JsonResponse({'success':True, 'msg':'Congratulations your article posted successfully.'})


class EditBlogApi(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        blog = Blog.objects.filter(slug=slug)
        context = dict()
        context['blog'] = EditBlogSerializer(blog, many=True).data
        return JsonResponse(context)

    def patch(self, request, slug):

        if request.data.get('thumbnail') == 'null' :
            thumbnail = 'images/thumbnail.jpeg'
        else:
            thumbnail = request.FILES['thumbnail']

        blog = Blog.objects.get(slug=slug)

        blog.title = request.data.get('title')
        blog.category = request.data.get('category')
        blog.description = request.data.get('description')
        blog.thumbnail = thumbnail
        blog.content = request.data.get('content')
        blog.save()

        return JsonResponse({'success':True, 'msg':'Congratulations your article updated successfully.'})

    def delete(self, request, slug):
        blog = Blog.objects.get(slug=slug)
        blog.delete()
        return Response({'success':True, 'msg':'Article deleted successfully.'})

class PostCommentApi(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        current_user = request.user

        user_obj = User.objects.filter(username=current_user).first()
        blogger_obj = Blogger.objects.filter(user=user_obj).first()

        obj = Blog.objects.filter(slug=slug).first()

        text = request.data.get('text')

        Comment.objects.create(
            user=blogger_obj,
            text=text,
            content_object=obj
        )

        user = obj.user.user
        blogger = blogger_obj
        content = obj
        msg = text
        text = "comment's on your article"
        img = 'http://localhost:8000/media/' + str(blogger.profile_pic)
        commentNotify(user, blogger, content, text, msg, img)

        return JsonResponse({'success': True, 'msg': 'Comment posted successfully.'})


class LikeBlogApi(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        current_user = request.user
        blogger_obj = Blogger.objects.filter(user=current_user).first()
        blog = Blog.objects.filter(slug=slug).first()

        if blogger_obj in blog.like.all():
            blog.like.remove(blogger_obj)
            msg = 'dislike successfully'

        else:
            blog.like.add(blogger_obj)

            user = blog.user.user
            blogger = blogger_obj
            content = blog
            text = 'likes your article'
            img = 'http://localhost:8000/media/'+str(blogger.profile_pic)

            likeNotify(user, blogger, content, text, img)
            msg = 'like successfully'

        return JsonResponse({'success': True, 'msg': msg})


class CommentLikeApi(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        current_user = request.user
        blogger_obj = Blogger.objects.filter(user=current_user).first()
        comnt = Comment.objects.filter(slug=slug).first()

        if blogger_obj in comnt.like.all():
            comnt.like.remove(blogger_obj)
            msg = 'dislike successfully'

        else:
            comnt.like.add(blogger_obj)

            user = comnt.user.user
            blogger = blogger_obj
            content = comnt
            text = 'likes your comment'
            img = 'http://localhost:8000/media/'+str(blogger.profile_pic)

            likeNotify(user, blogger, content, text, img)
            msg = 'like successfully'

        return JsonResponse({'success': True, 'msg': msg})


class SearchApi(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, search_data):
        current_user = request.user
        user = Blogger.objects.filter(user__username=current_user).annotate(blockedUsers=F('blocked_by_users__username')).values_list('blockedUsers', flat=True)
        user = list(user)

        context = dict()
        if search_data == 'e-m-p-t-y':
            blogResult = Blog.objects.exclude(user__user__username__in=user).annotate(currentUser=V(str(current_user)), checkLike=Count('like', filter=Q(like__user__username__in=[current_user]))).all().order_by('-created_at')

        else:
            blogResult = Blog.objects.exclude(user__user__username__in=user).filter(
                Q(title__icontains=search_data)|Q(category__icontains=search_data)).annotate(currentUser=V(str(current_user)), checkLike=Count('like', filter=Q(like__user__username__in=[current_user]))).all().order_by('-created_at')
            userResult = Blogger.objects.exclude(user__username__in=user).filter(
                Q(user__username__icontains=search_data) | Q(user__first_name__icontains=search_data))

            context['user'] = BloggerSerializer(userResult, many=True).data
        context['blog'] = BlogSerializer(blogResult, many=True).data
        return JsonResponse(context)


class FollowApi(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_user = request.user
        action = request.data.get('action')
        follow_user = request.data.get('username')

        follow_user_obj = User.objects.filter(username=follow_user).first()

        blogger = Blogger.objects.filter(user=current_user).first()
        follow_blogger = Blogger.objects.filter(user=follow_user_obj).first()

        if action == 'follow':
            blogger.following.add(follow_user_obj)
            follow_blogger.followers.add(current_user)
        else:
            blogger.following.remove(follow_user_obj)
            follow_blogger.followers.remove(current_user)

        return JsonResponse({'success': True, 'msg': 'follow successfully'})


class ChangeImageApi(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_user = request.user
        action = request.data['action']
        image = request.FILES['image']

        blogger = Blogger.objects.filter(user=current_user).first()
        if not blogger:
            return JsonResponse({'success': False, 'msg': 'user not found.'})

        if action == 'profile_pic':
            blogger.profile_pic = image
            blogger.save()
            return JsonResponse({'success': True, 'msg': 'profile-pic changed successfully.'})

        else:
            blogger.background_pic = image
            blogger.save()
            return JsonResponse({'success':True, 'msg': 'background image changed successfully.'})

class BlockUserApi(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        current_user = request.user

        other_user = request.data['username']
        action = request.data['action']

        other_user_obj = User.objects.filter(username=other_user).first()
        blogger_obj = Blogger.objects.filter(user=current_user).first()
        other_blogger_obj = Blogger.objects.filter(user=other_user_obj).first()

        if action == 'block':
            blogger_obj.block_users.add(other_user_obj)
            other_blogger_obj.blocked_by_users.add(current_user)
            return JsonResponse({'success': True, 'msg': 'block successfully.'})

        if action == 'unblock':
            blogger_obj.block_users.remove(other_user_obj)
            other_blogger_obj.blocked_by_users.remove(current_user)
            return JsonResponse({'success': True, 'msg': 'unblock successfully.'})

        return JsonResponse({'success': False, 'error': 'somethig went wrong.'})


from django.views.generic import TemplateView
from django.views.decorators.cache import never_cache

index = never_cache(TemplateView.as_view(template_name='index.html'))

