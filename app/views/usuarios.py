from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib.auth.models import User

def lista_usuarios(request):
    usuarios = User.objects.all()
    return render(request, 'usuarios/index.html',{
        'usuarios': usuarios
    })