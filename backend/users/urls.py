from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup),
    path("login/", views.login),
    path("profile/", views.fetch_profile),
    path("profile/update/", views.update_profile_data),
    path("gemini/update/", views.update_gemini_key),
]
