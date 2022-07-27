from django.shortcuts import render

# Create your views here.

#rest framework imports
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

#My imports
from .models import *
from .serializers import *

#django user imports
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, User):
        token = super().get_token(User)
        token['username'] = User.username
        

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):
    data = request.data
    username = data['username']
    password = data['password']
    first_name = data['first_name']
    last_name = data['last_name']
    email = data['email']

    user = User.objects.create_user(username=username,
                                 email=email,
                                 password=password,first_name=first_name,last_name=last_name)
    return Response("New User Created", status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def registerTask(request):
    serializer = TaskSerializer(data = request.data)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response("Task Created", status=status.HTTP_201_CREATED)

@api_view(['PATCH'])
def updateTask(request):
    task_id = request.data['id']
    task = Task.objects.filter(id = task_id)[0]
    serializer = TaskSerializer(instance = task,data = request.data)
    print(serializer.error_messages)
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response("Task Updated", status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def displayTasks(request):
    user = request.user
    notes = user.task_set.all() #grabs children of user. (the many relation to one relation)
    serializer = TaskSerializer(notes, many=True)
    return Response(serializer.data)


    


#next: Add view to delete Tasks--not complete.
#delete user account.