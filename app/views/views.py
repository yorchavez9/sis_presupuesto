from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.contrib.auth.decorators import login_required
from ..models import Profile

def index(request):
    # Mostrar información del usuario si está autenticado
    if request.user.is_authenticated:
        try:
            profile = request.user.profile
            rol_display = dict(Profile.ROLES).get(profile.rol, profile.rol)
        except Profile.DoesNotExist:
            rol_display = "Sin rol asignado"
        
        return render(request, 'index.html', {
            'user': request.user,
            'rol': rol_display
        })
    return render(request, 'index.html')

def signup(request):
    if request.method == 'GET':
        # Pasar los roles disponibles al template
        roles = Profile.ROLES
        return render(request, 'signup.html', {
            'roles': roles
        })
    else:
        username = request.POST.get('username')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        first_name = request.POST.get('first_name')
        email = request.POST.get('email')
        rol = request.POST.get('rol', 'cliente')  # Valor por defecto
        
        # Validaciones básicas
        if not username or not password1 or not password2:
            return render(request, 'signup.html', {
                'roles': Profile.ROLES,
                'error': 'Nombre de usuario y contraseña son obligatorios',
                'preserve_data': request.POST
            })
            
        if password1 != password2:
            return render(request, 'signup.html', {
                'roles': Profile.ROLES,
                'error': 'Las contraseñas no coinciden',
                'preserve_data': request.POST
            })
            
        # Verificar que el rol sea válido
        valid_roles = [choice[0] for choice in Profile.ROLES]
        if rol not in valid_roles:
            rol = 'cliente'  # Asignar rol por defecto si no es válido
            
        try:
            # Crear usuario
            user = User.objects.create_user(
                username=username,
                password=password1,
                first_name=first_name,
                email=email
            )
            
            # Crear perfil con el rol
            Profile.objects.create(user=user, rol=rol)
            
            # Autenticar y loguear al usuario
            login(request, user)
            return redirect('index')
            
        except IntegrityError:
            return render(request, 'signup.html', {
                'roles': Profile.ROLES,
                'error': 'El nombre de usuario ya existe',
                'preserve_data': request.POST
            })
        except Exception as e:
            return render(request, 'signup.html', {
                'roles': Profile.ROLES,
                'error': f'Ocurrió un error: {str(e)}',
                'preserve_data': request.POST
            })

def signin(request):
    if request.method == 'GET':
        return render(request, 'signin.html')
    else:
        username = request.POST.get('username')
        password = request.POST.get('password')
        
        if not username or not password:
            return render(request, 'signin.html', {
                'error': 'Nombre de usuario y contraseña son obligatorios'
            })
            
        user = authenticate(request, username=username, password=password)
        
        if user is None:
            return render(request, 'signin.html', {
                'error': 'Usuario o contraseña incorrectos'
            })
            
        login(request, user)
        
        # Redirección basada en el rol
        try:
            profile = user.profile
            if profile.rol == 'super_admin':
                return redirect('index')
            elif profile.rol == 'gerente_rrhh':
                return redirect('index')
            # Agrega más redirecciones según roles
        except Profile.DoesNotExist:
            pass
            
        return redirect('index')

@login_required
def signout(request):
    logout(request)
    return redirect('index')