from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import MadreComunitaria
from .forms import MadreComunitariaForm


# Create your views here.
def login(request):
    return render(request, 'app_indata/login/login.html', {})

# Crear y listar personas
def lista_personas(request):
    madre = MadreComunitaria.objects.all()
    if not madre:
        messages.info(request, "No hay madres comunitarias registradas.")
    return render(request, 'app_indata/dashboard_admin/lista.html', {'madres': madre})

def agregar_persona(request):
    if request.method == 'POST':
        form = MadreComunitariaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_personas')
    else:
        form = MadreComunitariaForm()
    return render(request, 'app_indata/dashboard_admin/formulario.html', {'form': form})


def editar_persona(request, pk):
    madre = get_object_or_404(MadreComunitaria, pk=pk)
    if request.method == 'POST':
        form = MadreComunitariaForm(request.POST, instance=madre)
        if form.is_valid():
            form.save()
            return redirect('lista_personas')
    else:
        form = MadreComunitariaForm(instance=madre)
    return render(request, 'app_indata/dashboard_admin/formulario.html', {'form': form})

def eliminar_persona(request, pk):
    madre = get_object_or_404(MadreComunitaria, pk=pk)
    if request.method == 'POST':
        madre.delete()
        return redirect('lista_personas')
    return render(request, 'app_indata/dashboard_admin/confirmar_eliminar.html', {'persona': madre})