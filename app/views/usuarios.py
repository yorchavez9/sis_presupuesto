from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from ..models import Profile

def index_usuario(request):
    return render(request, 'usuarios/index.html')

def lista_usuarios(request):
    if request.method == 'GET':
        usuarios = User.objects.all().order_by('-date_joined')
        usuarios_data = []
        
        for user in usuarios:
            try:
                profile = user.profile
                rol = profile.rol
                rol_display = dict(Profile.ROLES).get(rol, rol)
            except Profile.DoesNotExist:
                rol = 'sin_rol'
                rol_display = 'Sin rol asignado'
            
            usuarios_data.append({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_active': user.is_active,
                'date_joined': user.date_joined,
                'rol': rol,
                'rol_display': rol_display
            })
        
        return JsonResponse(usuarios_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status=400)

def crear_usuario(request):
    if request.method == 'POST':
        password = request.POST.get('password1')
        username = request.POST.get('username')
        email = request.POST.get('email')
        first_name = request.POST.get('first_name')
        rol = request.POST.get('rol', 'cliente')  # Rol por defecto 'cliente'

        # Validar que el rol sea válido
        valid_roles = [choice[0] for choice in Profile.ROLES]
        if rol not in valid_roles:
            return JsonResponse({'status': False, 'message': 'Rol no válido'})

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
            is_active=True
        )

        # Crear el perfil con el rol asignado
        Profile.objects.create(user=user, rol=rol)

        return JsonResponse({
            'status': True, 
            'message': 'Usuario creado exitosamente', 
            'user_id': user.id,
            'rol': rol
        })

    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

 # Solo estos roles pueden activar/desactivar
def activar_usuario(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user_estado = request.POST.get('user_estado')
        
        # No permitir que un usuario se desactive a sí mismo
        if str(request.user.id) == user_id:
            return JsonResponse({
                'status': False, 
                'message': 'No puedes desactivar tu propia cuenta'
            }, status=400)
            
        user = get_object_or_404(User, pk=user_id)
        user.is_active = True if user_estado == '1' else False
        user.save()
        
        message = 'Usuario activado correctamente' if user.is_active else 'Usuario desactivado correctamente'
        return JsonResponse({'status': True, 'message': message})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)
def borrar_usuario(request, user_id):
    if request.method == 'POST':
        # No permitir que un usuario se elimine a sí mismo
        if str(request.user.id) == user_id:
            return JsonResponse({
                'status': False, 
                'message': 'No puedes eliminar tu propia cuenta'
            }, status=400)
            
        user = get_object_or_404(User, pk=user_id)
        user.delete()
        return JsonResponse({'status': True, 'message': 'Usuario eliminado correctamente'})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)
def editar_usuario(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user = get_object_or_404(User, pk=user_id)
        
        try:
            profile = user.profile
            rol = profile.rol
        except Profile.DoesNotExist:
            rol = 'cliente'
        
        user_data = {
            'id': user.id,
            'first_name': user.first_name,
            'email': user.email,
            'username': user.username,
            'rol': rol,
            'roles': [{'value': r[0], 'display': r[1]} for r in Profile.ROLES]
        }
        
        return JsonResponse({
            'status': True, 
            'message': 'Datos del usuario obtenidos correctamente', 
            'user': user_data
        })
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)
def actualizar_usuario(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        user = get_object_or_404(User, pk=user_id)
        
        # No permitir que usuarios no super_admin modifiquen super_admins
        if (user.profile.rol == 'super_admin' and 
            request.user.profile.rol != 'super_admin'):
            return JsonResponse({
                'status': False, 
                'message': 'No tienes permisos para modificar este usuario'
            }, status=403)
        
        user.first_name = request.POST.get('first_name')
        user.email = request.POST.get('email')
        user.username = request.POST.get('username')
        password1 = request.POST.get('password1')
        
        if password1:
            user.password = make_password(password1)
        
        user.save()
        
        # Actualizar el rol si se proporcionó
        rol = request.POST.get('rol')
        if rol:
            try:
                profile = user.profile
                profile.rol = rol
                profile.save()
            except Profile.DoesNotExist:
                Profile.objects.create(user=user, rol=rol)
        
        return JsonResponse({
            'status': True, 
            'message': 'Usuario actualizado correctamente',
            'rol': rol or user.profile.rol
        })
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)