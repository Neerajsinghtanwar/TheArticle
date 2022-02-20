from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Blogger(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blogger')
    profile_pic = models.ImageField(upload_to='profile/%Y/%m/%d/', default='images/profilePic.png')
    background_pic = models.ImageField(upload_to='background/%Y/%m/%d/', default='images/backgroundPic.jpg')
    followers = models.ManyToManyField(User, related_name='followers', blank=True)
    following = models.ManyToManyField(User, related_name='following', blank=True)
    block_users = models.ManyToManyField(User, related_name='blockUsers', blank=True)
    blocked_by_users = models.ManyToManyField(User, related_name='blockByUsers', blank=True)

    def __str__(self):
        return self.user.username
