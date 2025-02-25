from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import Cliente
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password

def index_clientes(request):
    return render(request, 'clientes/index.html')

def lista_clientes(request):
    if request.method == 'GET':
        clientes = Cliente.objects.all()
        clientes_data = [
            {
                'id': cliente.id,
                'tipo_documento': cliente.tipo_documento,
                'num_documento': cliente.num_documento,
                'nombre': cliente.nombre,
                'direccion': cliente.direccion,
                'telefono': cliente.telefono,
                'correo': cliente.correo,
                'estado': cliente.estado
            } for cliente in clientes
        ]
        return JsonResponse(clientes_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status=400)

@csrf_exempt
def crear_cliente(request):
    if request.method == 'POST':
        tipo_documento = request.POST.get('tipo_documento')
        num_documento = request.POST.get('num_documento')
        nombre = request.POST.get('nombre')
        direccion = request.POST.get('direccion')
        telefono = request.POST.get('telefono')
        correo = request.POST.get('correo')

        cliente = Cliente(
            tipo_documento=tipo_documento,
            num_documento=num_documento,
            nombre=nombre,
            direccion=direccion,
            telefono=telefono,
            correo=correo
        )
        cliente.save()
        return JsonResponse({'status': True, 'message': 'Cliente creado exitosamente', 'cliente_id': cliente.id})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_cliente(request):
    if request.method == 'POST':
        cliente_id = request.POST.get('cliente_id')
        cliente = get_object_or_404(Cliente, id=cliente_id)
        cliente.delete()
        return JsonResponse({'status': True, 'message': 'Cliente eliminado exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)