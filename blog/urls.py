from django.urls import path
from .views import *
from .tests import *

urlpatterns = [
    path('', HomePageAPI.as_view(), name='homePage'),
    path('dashboard/<str:user_name>', DashBoardAPI.as_view(), name='dashboard'),
    path('create-article', BlogApi.as_view(), name='blogApi'),
    path('edit-article/<str:slug>', EditBlogApi.as_view(), name='editBlogApi'),
    path('post-comment/<str:slug>', PostCommentApi.as_view(), name='postComment'),
    path('like-blog/<str:slug>', LikeBlogApi.as_view(), name='likeBlog'),
    path('like-comment/<str:slug>', CommentLikeApi.as_view(), name='likeComment'),
    path('search/<str:search_data>', SearchApi.as_view(), name='search'),
    path('follow', FollowApi.as_view(), name='follow'),
    path('block', BlockUserApi.as_view()),
    path('change-image', ChangeImageApi.as_view(), name='changeImage'),

]