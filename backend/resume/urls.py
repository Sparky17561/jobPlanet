from django.urls import path
from . import views

urlpatterns = [
    path('generate-pdf/', views.generate_pdf, name="generate_pdf"),
    path("generate/", views.resume_generate, name="resume-generate"),
    path("enhance/", views.resume_enhance),
    path("download/<str:id>/", views.resume_download),
    path("pdf/<str:id>/", views.resume_pdf),

]
