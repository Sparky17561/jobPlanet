from django.urls import path
from . import views



urlpatterns = [
    # Endpoint for generating a Cold Email
    # Note: Using views.ViewName.as_view() for class-based views
    path('cold-mail/', views.cold_mail_view, name='cold-mail'),
    
    # Endpoint for generating a Cold DM/Connection Message
    path('cold-dm/', views.cold_dm_view, name='cold-dm'),
    
    # Endpoint for generating a Cover Letter
    path('cover-letter/', views.cover_letter_view, name='cover-letter'),
]