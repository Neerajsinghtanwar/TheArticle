from django.db import models
from accounts.models import *
# from blog.models import Blog
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from datetime import datetime
from django.core.exceptions import ValidationError
from django.template.defaultfilters import slugify

# Create your models here.

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    created_by = models.ForeignKey(Blogger, on_delete=models.CASCADE)
    text = models.CharField(max_length=500)
    msg = models.CharField(max_length=500, null=True)
    slug = models.SlugField(max_length=50, null=True)
    timeStamp = models.DateTimeField(default=datetime.now)
    seen = models.BooleanField(default=False)
    image_url = models.CharField(max_length=200, null=True)


    def __str__(self):
        obj = ContentType.objects.get_for_model(self.content_object)
        return str(self.slug)
