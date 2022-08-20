from django.db import models
from django.contrib.auth.models import User
import datetime
from datetime import timedelta

# Create your models here.


class Task(models.Model):
    def calculate():
        return datetime.date.today() + timedelta(days=14)

    task_name = models.CharField(max_length=40, blank = False)
    task_info = models.TextField(max_length=100)
    task_created = models.DateTimeField(auto_now_add = True)
    task_due = models.DateTimeField(default=calculate)
    isCompleted = models.BooleanField(default = False)
    taskOwner = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.task_name
