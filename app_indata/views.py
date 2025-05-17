from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Persona
from .forms import PersonaForm


# Create your views here.
def login(request):
    return render(request, 'app_indata/login/login.html', {})

# Crear y listar personas
def lista_personas(request):
    personas = Persona.objects.all()
    return render(request, 'app_indata/dashboard_admin/lista.html', {'personas': personas})

def agregar_persona(request):
    if request.method == 'POST':
        form = PersonaForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('lista_personas')
    else:
        form = PersonaForm()
    return render(request, 'app_indata/dashboard_admin/formulario.html', {'form': form})


def editar_persona(request, pk):
    persona = get_object_or_404(Persona, pk=pk)
    if request.method == 'POST':
        form = PersonaForm(request.POST, instance=persona)
        if form.is_valid():
            form.save()
            return redirect('lista_personas')
    else:
        form = PersonaForm(instance=persona)
    return render(request, 'app_indata/dashboard_admin/formulario.html', {'form': form})

def eliminar_persona(request, pk):
    persona = get_object_or_404(Persona, pk=pk)
    if request.method == 'POST':
        persona.delete()
        return redirect('lista_personas')
    return render(request, 'app_indata/dashboard_admin/confirmar_eliminar.html', {'persona': persona})