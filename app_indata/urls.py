from django.urls import path
from . import views

urlpatterns = [
    path('', views.login, name='login'),
    path('listar/', views.lista_personas, name='lista_personas'),
    path('agregar/', views.agregar_persona, name='agregar_persona'),
    path('editar/<int:pk>/', views.editar_persona, name='editar_persona'),
    path('eliminar/<int:pk>/', views.eliminar_persona, name='eliminar_persona'),
]
