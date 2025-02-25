from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password

def index_usuario(request):
    return render(request, 'usuarios/index.html')

def lista_usuarios(request):
    if request.method == 'GET':
        usuarios = User.objects.all()
        usuarios_data = [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active,
                'date_joined': user.date_joined
            } for user in usuarios
        ]
        return JsonResponse(usuarios_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status=400)

@csrf_exempt
def crear_usuario(request):
    if request.method == 'POST':
        password = request.POST.get('password1')
        username = request.POST.get('username')
        email = request.POST.get('email')
        first_name = request.POST.get('first_name')

        if not username or not email or not password:
            return JsonResponse({'status': False, 'message': 'Faltan datos obligatorios'})

        if User.objects.filter(username=username).exists():
            return JsonResponse({'status': False, 'message': 'El nombre de usuario ya existe'})

        if User.objects.filter(email=email).exists():
            return JsonResponse({'status': False, 'message': 'El correo electrónico ya está registrado'})

        user = User.objects.create(
            password=make_password(password),
            username=username,
            first_name=first_name,
            email=email,
        )

        return JsonResponse({'status': True, 'message': 'Usuario creado exitosamente', 'user_id': user.id})

    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def activar_usuario(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user_estado = request.POST.get('user_estado')
        user = get_object_or_404(User, pk=user_id)
        user.is_active = user_estado
        user.save()
        return JsonResponse({'status': True, 'message': 'Usuario actualizado correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)



@csrf_exempt
def borrar_usuario(request, user_id):
    if request.method == 'POST':
        user = get_object_or_404(User, pk=user_id)
        user.delete()
        return JsonResponse({'status': True, 'message': 'Usuario eliminado correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def editar_usuario(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user = get_object_or_404(User, pk=user_id)
        
        user_data = {
            'id': user.id,
            'first_name': user.first_name,
            'email': user.email,
            'username': user.username,
            'password': user.password
        }
        
        return JsonResponse({'status': True, 'message': 'Datos del usuario obtenidos correctamente', 'user': user_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def actualizar_usuario(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user = get_object_or_404(User, pk=user_id)
        user.first_name = request.POST.get('first_name')
        user.email = request.POST.get('email')
        user.username = request.POST.get('username')
        password1 = request.POST.get('password1')
        if password1:
            user.password = make_password(password1)
        user.save()
        return JsonResponse({'status': True, 'message': 'Usuario actualizado correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)
