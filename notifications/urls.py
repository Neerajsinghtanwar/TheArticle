from django.urls import path
from .views import *
urlpatterns = [
    path('', NotificationAPI.as_view(), name='notifications'),
    path('seen/', SeenAPI.as_view(), name='seen'),
]