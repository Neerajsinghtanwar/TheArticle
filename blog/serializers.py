from rest_framework import serializers
from django.core import serializers as s
from .models import *
from blog.models import *
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.db.models import F, Value as V

class LikeSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username')
    class Meta:
        model = Blogger
        fields = ['username']

    def get_username(self, blogger_obj):
        username = blogger_obj.user.username
        return username


class CommentSerializer(serializers.ModelSerializer):
    fullname = serializers.SerializerMethodField('get_fullname')
    profile_pic = serializers.SerializerMethodField('get_image_url')
    timeStamp = serializers.SerializerMethodField('get_timeStamp')
    CheckLike = serializers.SerializerMethodField('get_checkLike')

    class Meta:
        model = Comment
        fields = '__all__'

    def get_fullname(self, coment):
        return coment.user.user.get_full_name()

    def get_image_url(self, coment):
        image = coment.user.profile_pic
        return str(image)

    def get_timeStamp(self, blog):
        data = blog.created_at

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

    def get_checkLike(self, blog):
        current_user = str(blog.currentUser)
        check = blog.like.all()
        for i in check:
            if current_user == str(i):
                return True


class BlogSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField('get_username')
    fullname = serializers.SerializerMethodField('get_fullname')
    profile_pic = serializers.SerializerMethodField('get_image_url')
    comments = serializers.SerializerMethodField('get_comments')
    CheckLikes = serializers.SerializerMethodField('get_check_like')
    timeStamp = serializers.SerializerMethodField('get_timeStamp')


    class Meta:
        model = Blog
        fields = '__all__'

    def get_image_url(self, blog):
        image = blog.user.profile_pic
        return str(image)

    def get_username(self, blog):
        username = blog.user.user.username
        return username

    def get_fullname(self, blog):
        return blog.user.user.get_full_name()

    def get_comments(self, blog):
        current_user = blog.currentUser
        comment_obj = blog.comment.annotate(currentUser=V(str(current_user))).all()
        comments = CommentSerializer(comment_obj, many=True).data
        return comments

    def get_check_like(self, blog):
        like = blog.checkLike
        return bool(like)

    def get_timeStamp(self, blog):
        data = blog.created_at

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

            print()

        return data


class BloggerSerializer(serializers.ModelSerializer):
    # blog = BlogSerializer(many=True, read_only=True)
    username = serializers.SerializerMethodField('get_username')
    fullname = serializers.SerializerMethodField('get_fullname')

    class Meta:
        model = Blogger
        fields = '__all__'

    def get_username(self, blogger_obj):
        username = blogger_obj.user.username
        return username

    def get_fullname(self, blogger_obj):
        return blogger_obj.user.get_full_name()


class UserFollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class FollowSerializer(serializers.ModelSerializer):
    blogger = BloggerSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['blogger']

class EditBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['title', 'category', 'description', 'thumbnail', 'content']


