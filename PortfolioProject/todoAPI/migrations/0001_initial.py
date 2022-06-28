# Generated by Django 4.0.3 on 2022-06-28 07:18

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import todoAPI.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Person',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=40)),
                ('password', models.CharField(max_length=40)),
                ('user_created', models.DateTimeField(auto_now_add=True)),
                ('first_name', models.CharField(max_length=40)),
                ('last_name', models.CharField(max_length=40)),
                ('email', models.CharField(max_length=60)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_info', models.TextField(max_length=40)),
                ('task_created', models.DateTimeField(auto_now_add=True)),
                ('task_due', models.DateTimeField(default=todoAPI.models.Task.calculate)),
                ('isCompleted', models.BooleanField(default=False)),
                ('task_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
