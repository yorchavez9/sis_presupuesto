from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import Categoria
from django.views.decorators.csrf import csrf_exempt
import requests

def index_categorias(request):
    return render(request, 'categorias/index.html')

def lista_categorias(request):
    if request.method == 'GET':
        categorias = Categoria.objects.all().order_by('-id')
        categorias_data = [
            {
                'id': categoria.id,
                'categoria': categoria.categoria,
                'descripcion': categoria.descripcion,
                'tipo': categoria.tipo
            } for categoria in categorias
        ]
        return JsonResponse(categorias_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status=400)

@csrf_exempt
def crear_categoria(request):
    if request.method == 'POST':
        categoria = request.POST.get('categoria')
        descripcion = request.POST.get('descripcion')
        tipo = request.POST.get('tipo')

        nueva_categoria = Categoria(
            categoria=categoria,
            descripcion=descripcion,
            tipo=tipo
        )
        nueva_categoria.save()
        return JsonResponse({'status': True, 'message': 'Categoría creada exitosamente', 'categoria_id': nueva_categoria.id})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def activar_categoria(request):
    if request.method == 'POST':
        categoria_id = request.POST.get('categoria_id')
        categoria_estado = request.POST.get('categoria_estado')
        categoria = get_object_or_404(Categoria, pk=categoria_id)
        categoria.estado = categoria_estado
        categoria.save()
        message = 'Categoría activada correctamente' if categoria_estado == '1' else 'Categoría desactivada correctamente'
        return JsonResponse({'status': True, 'message': message})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def editar_categoria(request):
    if request.method == 'POST':
        categoria_id = request.POST.get('categoria_id')
        categoria = get_object_or_404(Categoria, pk=categoria_id)
        
        categoria_data = {
            'id': categoria.id,
            'categoria': categoria.categoria,
            'descripcion': categoria.descripcion,
            'tipo': categoria.tipo
        }
        
        return JsonResponse({'status': True, 'message': 'Datos de la categoría obtenidos correctamente', 'categoria': categoria_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def actualizar_categoria(request):
    if request.method == 'POST':
        categoria_id = request.POST.get('categoria_id')
        categoria = get_object_or_404(Categoria, pk=categoria_id)
        
        categoria.categoria = request.POST.get('categoria')
        categoria.descripcion = request.POST.get('descripcion')
        categoria.tipo = request.POST.get('tipo')
        
        categoria.save()
        
        return JsonResponse({'status': True, 'message': 'Categoría actualizada correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def eliminar_categoria(request):
    if request.method == 'POST':
        categoria_id = request.POST.get('categoria_id')
        categoria = get_object_or_404(Categoria, id=categoria_id)
        categoria.delete()
        return JsonResponse({'status': True, 'message': 'Categoría eliminada exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)
