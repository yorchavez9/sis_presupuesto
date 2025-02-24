from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User

def index_usuario(request):
    return render(request, 'usuarios/index.html')

def lista_usuarios(request):
    if request.method == 'GET':  # Removida la verificación de content_type
        usuarios = User.objects.all()
        # Serializar los datos de usuario
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