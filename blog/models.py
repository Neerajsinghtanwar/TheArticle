from django.db import models
from ckeditor_uploader.fields import RichTextUploadingField
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation, GenericForeignKey
from notifications.models import Notification
from django.template.defaultfilters import slugify
from datetime import datetime
from accounts.models import Blogger
from channels.layers import get_channel_layer

# Create your models here.
class CommonFields(models.Model):
    created_at = models.DateTimeField(default=datetime.now)
    updated_at = models.DateTimeField(null=True)

    notifications = GenericRelation(Notification)

    class Meta:
        abstract = True


class Comment(CommonFields):
    user = models.ForeignKey(Blogger, on_delete=models.CASCADE)

    text = models.TextField()
    like = models.ManyToManyField(Blogger, related_name='cLikes', blank=True)
    slug = models.SlugField(max_length=500)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return  self.text[:20]

    def save(self, *args, **kwargs):
        text = self.text*5
        txt = len(text)//2
        if txt < 5:
            tex = txt
        else:
            tex = 5

        original_slug = slugify(text[tex:txt])
        queryset = Comment.objects.all().filter(slug__iexact=original_slug).count()

        count = 1
        slug = original_slug
        while(queryset):
            slug = original_slug + '-' + str(count)
            count += 1
            queryset = Comment.objects.all().filter(slug__iexact=slug).count()

        self.slug = slug
        super(Comment, self).save(*args, **kwargs)

class Categories(models.TextChoices):
    WORLD = 'world'
    ENVIRONMENT = 'environment'
    TECHNOLOGY = 'technology'
    DESIGN = 'design'
    CULTURE = 'culture'
    BUSINESS = 'business'
    POLITICS = 'politics'
    OPINION = 'opinion'
    SCIENCE = 'science'
    HEALTH = 'health'
    STYLE = 'style'
    TRAVEL = 'travel'

class Blog(CommonFields):
    user = models.ForeignKey(Blogger, on_delete=models.CASCADE, related_name='blog')

    title = models.CharField(max_length=500)
    slug = models.SlugField(max_length=600)
    category = models.CharField(max_length=50, choices=Categories.choices, default=Categories.WORLD)
    description = models.TextField()
    content = RichTextUploadingField()
    thumbnail = models.ImageField(upload_to='thumbnail/%Y/%m/%d/', default='images/thumbnail.jpeg', null=True, blank=True)
    shares = models.ManyToManyField(Blogger, related_name='shares', blank=True)
    comment = GenericRelation(Comment, related_query_name="blogComment")
    like = models.ManyToManyField(Blogger, related_name='likes', blank=True)

    def save(self, *args, **kwargs):
        original_slug = slugify(self.title)
        queryset = Blog.objects.all().filter(slug__iexact=original_slug).count()

        count = 1
        slug = original_slug
        while(queryset):
            slug = original_slug + '-' + str(count)
            count += 1
            queryset = Blog.objects.all().filter(slug__iexact=slug).count()

        self.slug = slug
        super(Blog, self).save(*args, **kwargs)

    def __str__(self):
        return self.slug

class SharedBlog(CommonFields):
    user = models.ForeignKey(Blogger, on_delete=models.CASCADE)

    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    comment = GenericRelation(Comment)
    like = models.ManyToManyField(Blogger, related_name='sbLikes')









from django.contrib import admin

# Register your models here.
@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'slug', 'created_at', 'updated_at']

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'text', 'slug', 'content_type', 'created_at']

admin.site.register(SharedBlog)