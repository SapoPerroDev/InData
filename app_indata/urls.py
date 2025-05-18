from django.urls import path
from . import views
from rest_framework.routers import DefaultRouter
from app_indata.api import MadreComunitariaViewSet

router = DefaultRouter()
router.register('api/madres', MadreComunitariaViewSet, basename='madre')
urlpatterns = router.urls

'''urlpatterns = [
    path('', views.login, name='login'),
    path('listar/', views.lista_personas, name='lista_personas'),
    path('agregar/', views.agregar_persona, name='agregar_persona'),
    path('editar/<int:pk>/', views.editar_persona, name='editar_persona'),
    path('eliminar/<int:pk>/', views.eliminar_persona, name='eliminar_persona'),
]'''
