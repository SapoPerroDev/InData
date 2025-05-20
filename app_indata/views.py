from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import PerfilUsuario
from .forms import UsuariosForm


# Create your views here.

def login(request):
    return render(request, 'app_indata/login/login.html', {})

# Crear y listar personas
def listar_madres(request):
     return render(request, 'app_indata/dashboard_admin/lista.html')

def agregar_persona(request):
    if request.method == 'POST':
        form = UsuariosForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_personas')
    else:
        form = UsuariosForm()
    return render(request, 'app_indata/dashboard_admin/formulario.html', {'form': form})


def editar_persona(request, pk):
    madre = get_object_or_404(PerfilUsuario, pk=pk)
    if request.method == 'POST':
        form = UsuariosForm(request.POST, instance=madre)
        if form.is_valid():
            form.save()
            return redirect('lista_personas')
    else:
        form = UsuariosForm(instance=madre)
    return render(request, 'app_indata/dashboard_admin/formulario.html', {'form': form})

def eliminar_persona(request, pk):
    madre = get_object_or_404(PerfilUsuario, pk=pk)
    if request.method == 'POST':
        madre.delete()
        return redirect('lista_personas')
    return render(request, 'app_indata/dashboard_admin/confirmar_eliminar.html', {'persona': madre})