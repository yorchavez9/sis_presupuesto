from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required

def index(request):
    return render(request, 'index.html')

def signup(request):
    if request.method == 'GET':
        return render(request, 'signup.html',{
            'form': UserCreationForm
        })
    else:
        if request.POST['password1'] == request.POST['password2']:
            #register user
            try:
                user =User.objects.create_user(username=request.POST['username'], password=request.POST['password1'])
                user.save()
                login(request, user)
                return redirect('index')
            except IntegrityError as e:
                return render(request, 'signup.html',{
                    'form': UserCreationForm,
                    'error': 'El usuario ya existe'
                })

def signin(request):
    if request.method == 'GET':
        return render(request, 'signin.html',{
            'form':AuthenticationForm
        })
    else:
        print(request.POST)
        user = authenticate(request, username=request.POST['username'], password=request.POST['password'])
        if user is None:
            return render(request, 'signin.html',{
                'form': AuthenticationForm,
                'error': 'Usuario o contraseña incorrecto'
            })
        else:
            login(request, user)
            return redirect('inicio')

@login_required        
def signout(request):
    logout(request)
    return redirect('index')
