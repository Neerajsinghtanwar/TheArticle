from django.shortcuts import HttpResponse
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.middleware import get_user



# Function-based middleware
# def MyMiddleware(get_response):
#     print("------------one time initialization-----------")     # One-time configuration and initialization.
#     def my_function(request, scope):
#         dict(scope['headers'])
#         print("------------This is before view-----------", request)     #This section is run the code for each request before the view is called.
#         response = get_response(request)       # This object runs view
#         print("------------This is after view------------")     #This section is run the code for each request/response after the view is called.
#         return response
#     return my_function

# Class-based middleware.
class MyMiddleware:
    # authentication_classes = [JWTAuthentication]
    # permission_classes = [IsAuthenticated]

    def __init__(self, get_response):
        self.get_response = get_response
        print("One Time Initialization-----")

    def __call__(self, request):
        user_jwt = get_user(request)
        token = request.META.get('HTTP_AUTHORIZATION', None)
        print("This is before view1----", request.GET)
        # print("This is before view2----", request.DATA)
        response = self.get_response(request)
        print("This is after view1-----", request.GET)
        print("This is after view2-----", request.POST)
        return response
