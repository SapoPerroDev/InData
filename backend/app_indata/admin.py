from django.contrib import admin
from .models import PerfilUsuario, entidadAdministradoraServicio, UnidadServicio, TipoDNI, TipoFocalizacion

# Register your models here.
admin.site.register(TipoFocalizacion)
admin.site.register(TipoDNI)
admin.site.register(entidadAdministradoraServicio)
admin.site.register(UnidadServicio)
admin.site.register(PerfilUsuario)
