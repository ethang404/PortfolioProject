from django.db import models
from django.contrib.auth.models import User
import datetime
from datetime import timedelta

# Create your models here.
class Task(models.Model):
    def calculate():
        return datetime.today() + timedelta(days=14)

    task_name = models.CharField(max_length=40)
    task_info = models.TextField(max_length=40)
    task_created = models.DateTimeField(auto_now_add = True)
    task_due = models.DateTimeField(default=calculate)
    isCompleted = models.BooleanField(default = False)
    task_name = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.task_name


#I find django auth model to be annoying and cause weird bugs. May implement later, but I prefer my own:
class Person(models.Model):
   
    username = models.CharField(max_length=40)
    password = models.CharField(max_length=40)
    user_created = models.DateTimeField(auto_now_add = True)
    first_name = models.CharField(max_length=40)
    last_name = models.CharField(max_length=40)
    email = models.CharField(max_length=60)