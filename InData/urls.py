
from django.contrib import admin
from django.urls import path, include
from app_indata import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app_indata.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
  
]
