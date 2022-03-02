from rest_framework.views import APIView
from .models import  *
from django.http import JsonResponse
import json
import re
from django.db.models import Q
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from .tasks import *
from django.conf import settings

# Create your views here.

class LoginAPI(APIView):
    def post(self, request):
        try:
            username_email = request.data.get('username')
            password = request.data.get('password')

            user = User.objects.filter(Q(username=username_email)|Q(email=username_email)).first()
            if not user:
                return JsonResponse({'success': False,
                                     'msg': 'Username or Email not exist.'})

            if not user.check_password(password):
                return JsonResponse({'success': False,
                                     'msg': 'Password does not match.'})

            return JsonResponse({'success': True, 'username':str(user)})

        except Exception as e:
            print(e)
            return JsonResponse({'success': False,
                                 'msg': str(e)})


class UserRegisterApi(APIView):
    def post(self, request):
        try:
            username = request.data['username']
            email = request.data['email']
            password = request.data['password1']
            firstName = request.data['firstName']
            lastName = request.data['lastName']

            low, up, num, spl = 0, 0, 0, 0
            if len(password) >= 8:
                for i in password:
                    if i.islower():
                        low += 1

                    if i.isupper():
                        up += 1

                    if i.isnumeric():
                        num += 1

                    if re.search(i, "!@#$%^&*()-_=+"):
                        spl += 1
            else:
                return JsonResponse({'success': False, 'msg': 'Your password contains at least 8 characters.'})

            if (low >= 1 and up >= 1 and num >= 1 and spl >= 1):
                user = User.objects.create_user(username, email, password)
                user.first_name = firstName
                user.last_name = lastName
                user.save()

                Blogger.objects.create(user=user)

                subject = 'Congratulations for register on The-Articles.'
                str_template = render_to_string("welcome_email.html", {'name': firstName + ' ' + lastName})
                message = strip_tags(str_template)
                email_from = settings.EMAIL_HOST_USER
                recipient_list = [email]

                send_mail_task.apply_async(args=['Welcome Mail Sent'],
                                           kwargs={'subject': subject, 'message': message, 'email_from': email_from,
                                                   'recipient_list': recipient_list, 'str_template': str_template})

                return JsonResponse({'success': True, 'msg': 'Congratulations your registeration completed successfully.'})

            return JsonResponse({'success': False,
                                 'msg': 'Your password contains lowercase, uppercase, numbers, special-characters.'})
        except Exception as e:
            print(e)
            return JsonResponse({'success': False,
                                     'msg': str(e)})




class ForgotPasswordApi(APIView):
    def post(self, request):
        try:
            username_email = request.data['username']
            password = request.data['password1']

            low, up, num, spl = 0, 0, 0, 0
            if len(password) >= 8:
                for i in password:
                    if i.islower():
                        low += 1

                    if i.isupper():
                        up += 1

                    if i.isnumeric():
                        num += 1

                    if re.search(i, "!@#$%^&*()-_=+"):
                        spl += 1
            else:
                return JsonResponse({'success': False, 'msg': 'Your password contains at least 8 characters.'})

            if not (low >= 1 and up >= 1 and num >= 1 and spl >= 1):
                return JsonResponse({'success': False,
                                     'msg': 'Your password contains lowercase, uppercase, numbers, special-characters.'})

            user = User.objects.filter(Q(username=username_email)|Q(email=username_email)).first()
            if not user:
                return JsonResponse({'success': False,
                                     'msg': 'Please enter correct username or email'})

            user.set_password(password)
            user.save()

            return JsonResponse({'success': True,
                                 'msg': 'Your password updated successfully.'})
        except Exception as e:
            print(e)
            return JsonResponse({'success': False,
                                     'msg': str(e)})