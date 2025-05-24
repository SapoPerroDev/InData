from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter
from django.contrib.auth import views as auth_views
from app_indata.api import UsuariosViewSet, LoginView

router = DefaultRouter()
router.register('api/madres', UsuariosViewSet, basename='madre')
#router.register('api/familias', FamiliaViewSet, basename='familia')
#router.register('api/ninos', NiñoViewSet, basename='niño')

urlpatterns = [
    path('', include(router.urls)), # API REST que maneja las madres comunitarias: GET, POST, PUT, DELETE
    path('api/login/', LoginView.as_view(), name='login'),   # API REST que maneja el login de los usuarios: POST
]

'''path('terminos/', views.terminos_condiciones, name='terminos'),
    path('login/', auth_views.LoginView.as_view(template_name='app_indata/login/login.html'), name='login'),
    path('logout/', auth_views.LogoutView.as_view(next_page='login'), name='logout'),
    path('lista/madres', views.listar_madres, name='lista_madres'),  # Devuelve el HTML
'''    

'''urlpatterns = [
    path('', views.login, name='login'),
    path('listar/', views.lista_personas, name='lista_personas'),
    path('agregar/', views.agregar_persona, name='agregar_persona'),
    path('editar/<int:pk>/', views.editar_persona, name='editar_persona'),
    path('eliminar/<int:pk>/', views.eliminar_persona, name='eliminar_persona'),
]'''
