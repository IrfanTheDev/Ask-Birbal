from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name = "index"),
    path("postedit", views.postedit, name="postedit"),
    path("ansedit", views.ansedit, name="ansedit"),
    path("profile/<str:username>", views.profile, name="profile"),
    path("answer/<int:postId>", views.answer, name="answer"),
    path("following", views.following, name="following"),
    path("bookmark", views.book_mark, name="bookmark"),

    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
]