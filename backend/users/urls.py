from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("login/", views.login, name="login"),
    path("profile/", views.fetch_profile, name="fetch-profile"),
    path("profile/update/", views.update_profile_data, name="update-profile-data"),
]
