from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from .models import User, Questions, Followers, Answers

# Create your views here.
def index(request):
    if request.method == "POST":
        # Attempt to sign user in
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("index"))

        ques = request.POST["ques"]
        Questions.objects.create(content=ques, user=request.user)
        return HttpResponseRedirect(reverse("index"))

    else:
        all_posts =  Questions.objects.all().order_by("-created_at")
        paginator = Paginator(all_posts, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        return render(request, "birbal/index.html", {
            "page_obj": page_obj
        })


@login_required
@csrf_exempt
def postedit(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('login'))

    data = json.loads(request.body)
    post_id = data.get("post_id", "")
    post = Questions.objects.get(id=post_id)

    content = data.get("content", "")
    toggle_like = data.get("toggle_like", "")
    toggle_bookmark = data.get("toggle_bookmark", "")

    if content:
        if request.user != post.user:
            return JsonResponse({"error": "Can only edit your own posts"})
        post.content = content

    if toggle_like:
        if request.user in post.likes.all():
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)

    if toggle_bookmark:
        if request.user in post.bookmark.all():
            post.bookmark.remove(request.user)
        else:
            post.bookmark.add(request.user)

    post.save()
   
    return JsonResponse({
        "message": "Post edited successfully", 
        "likes_num": str(post.likes.count()), 
        "bmark_num": str(post.bookmark.count())}, status=201)

@login_required
@csrf_exempt
def ansedit(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse('login'))

    data = json.loads(request.body)
    post_id = data.get("post_id", "")
    post = Answers.objects.get(id=post_id)

    content = data.get("content", "")
    toggle_useful = data.get("toggle_useful", "")


    if content:
        if request.user != post.user:
            return JsonResponse({"error": "Can only edit your own posts"})
        post.content = content

    if toggle_useful:
        if request.user in post.useful.all():
            post.useful.remove(request.user)
        else:
            post.useful.add(request.user)


    post.save()
   
    return JsonResponse({
        "message": "Post edited successfully", 
        "useful_num": str(post.useful.count()), 
        }, status=201)




def profile(request, username):
    user_profile = User.objects.get(username=username)

    if request.method == "POST":
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse('login'))

        if "unfollow_btn" in request.POST:
            Followers.objects.get(user=user_profile, follower=request.user).delete()
        elif "follow_btn" in request.POST:
            Followers.objects.create(user=user_profile, follower=request.user)
        else:
            print("Error: wrong input name")
        return HttpResponseRedirect(reverse("profile", args=(username, )))

    curr_user_follows_this_profile = False
    if request.user.is_authenticated:
        curr_user_follows_this_profile = request.user.following.filter(user=user_profile.id).exists()

    user_posts = user_profile.posts.order_by("-created_at").all()
    paginator = Paginator(user_posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "birbal/profile.html", {
        "user_profile": user_profile,
        "user_posts": user_profile.posts.order_by("-created_at").all(),
        "page_obj": page_obj,
        "following_profile": curr_user_follows_this_profile
    })


def answer(request, postId):
    que_post = Questions.objects.get(id=postId)

    if request.method == "POST":
        # Attempt to sign user in
        if not request.user.is_authenticated:
            return HttpResponseRedirect(reverse("index"))

        ques = request.POST["answer"]
        Answers.objects.create(content=ques, user=request.user, answerFor= que_post)
        return HttpResponseRedirect(reverse("answer", args=(postId, )))

    else:
        # if request.method == "POST":
        #     if not request.user.is_authenticated:
        #         return HttpResponseRedirect(reverse('login'))

        #     if "unfollow_btn" in request.POST:
        #         Followers.objects.get(user=user_profile, follower=request.user).delete()
        #     elif "follow_btn" in request.POST:
        #         Followers.objects.create(user=user_profile, follower=request.user)
        #     else:
        #         print("Error: wrong input name")
        #     return HttpResponseRedirect(reverse("profile", args=(username, )))

        # curr_user_follows_this_profile = False
        # if request.user.is_authenticated:
        #     curr_user_follows_this_profile = request.user.following.filter(user=user_profile.id).exists()

        ans_posts = Answers.objects.filter(answerFor=que_post).order_by("-created_at").all()

        return render(request, "birbal/answer.html", {
        "ans_posts": ans_posts ,
        "post": que_post
        })


@login_required
def following(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))
    user = User.objects.get(id=request.user.id)
    # this syntax uses related_name of Followers class effectively.
    followed_users = [followRelation.user for followRelation in user.following.all()]
    posts = Questions.objects.filter(user__in=followed_users).order_by("-created_at")
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "birbal/index.html", {
        "page_obj": page_obj,
        "followed_users": followed_users
    })

@login_required
def book_mark(request):
    if not request.user.is_authenticated:
        return HttpResponseRedirect(reverse("login"))
    user = User.objects.get(id=request.user.id)
    posts = Questions.objects.filter(bookmark=user).order_by("-created_at")
    paginator = Paginator(posts, 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, "birbal/index.html", {
        "page_obj": page_obj,
    })



def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "birbal/index.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "birbal/index.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "birbal/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.first_name = first_name
            user.last_name = last_name
            user.save()
        except IntegrityError:
            return render(request, "birbal/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "birbal/register.html")
