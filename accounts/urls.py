from django.urls import path
from .views import *
urlpatterns = [
    path('login/', LoginAPI.as_view(), name='homePage'),
    path('register-user/', UserRegisterApi.as_view(), name='userRegister'),
    path('forgot-password/', ForgotPasswordApi.as_view(), name='forgotPassword'),
    # path('profile/<str:user_name>', views.profile, name='profile'),
    # path('login/', views.login_user, name='login'),
    # path('logout/', views.logout_user, name='logout'),
    # path('follow/<str:user_name>', views.follow_user, name='follow'),
]