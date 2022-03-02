from django.urls import path
from .views import *
urlpatterns = [
    path('login/', LoginAPI.as_view(), name='homePage'),
    path('register-user/', UserRegisterApi.as_view(), name='userRegister'),
    path('forgot-password/', ForgotPasswordApi.as_view(), name='forgotPassword'),
]