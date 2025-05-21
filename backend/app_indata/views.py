from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import PerfilUsuario
from .forms import UsuariosForm
from django.contrib.auth.decorators import login_required


# Create your views here.

def terminos_condiciones(request):
    return render(request, 'app_indata/terminos&condiciones.html')

@login_required
def redireccion_dashboard(request):
    """Redirige al dashboard según el tipo de usuario."""
    if request.user.is_superuser or request.user.tipo == 'admin':
        return redirect('dashboard_admin')
    elif request.user.tipo == 'madre':
        return redirect('dashboard_madre')
    return redirect('login')

def login(request):
    return render(request, 'app_indata/login/login.html', {})

# listar madres
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