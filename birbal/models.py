from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass


class Followers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")


class Questions(models.Model):
    content = models.CharField(max_length=280)
    bookmark = models.ManyToManyField(User, related_name="bookmarked_que")
    likes = models.ManyToManyField(User, related_name="liked_posts")
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")


class Answers(models.Model):
    content = models.TextField()
    answerFor = models.ForeignKey(Questions, on_delete = models.CASCADE, related_name="answer_for")
    useful = models.ManyToManyField(User, related_name="useful_posts")
    created_at = models.DateTimeField(auto_now_add=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ans")
