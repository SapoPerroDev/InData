from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from app_indata.api import UsuariosViewSet

router = DefaultRouter()
router.register('api/madres', UsuariosViewSet, basename='madre')
#router.register('api/familias', FamiliaViewSet, basename='familia')
#router.register('api/ninos', NiñoViewSet, basename='niño')

urlpatterns = [
    path('', views.listar_madres, name='lista_madres'),  # Devuelve el HTML
    path('', include(router.urls)),   # API REST
]

'''urlpatterns = [
    path('', views.login, name='login'),
    path('listar/', views.lista_personas, name='lista_personas'),
    path('agregar/', views.agregar_persona, name='agregar_persona'),
    path('editar/<int:pk>/', views.editar_persona, name='editar_persona'),
    path('eliminar/<int:pk>/', views.eliminar_persona, name='eliminar_persona'),
]'''
