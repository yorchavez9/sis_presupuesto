from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from ..models import Comprobante

def index_comprobante(request):
    return render(request, 'comprobantes/index.html')

def lista_comprobantes(request):
    if request.method == 'GET':
        comprobantes = Comprobante.objects.all().order_by('-id')
        comprobante_data = [
            {
                'id': comprobante.id,
                'comprobante': comprobante.comprobante,
                'serie': comprobante.serie,
                'folio_inicial': comprobante.folio_inicial,
                'folio_final': comprobante.folio_final,
                'fecha': comprobante.fecha
            } for comprobante in comprobantes
        ]
        return JsonResponse(comprobante_data, safe=False)
    return JsonResponse({'error': 'Solicitud no válida'}, status=400)

def crear_comprobante(request):
    if request.method == 'POST':
        comprobante = request.POST.get('comprobante')
        serie = request.POST.get('serie')
        folio_inicial = request.POST.get('folio_inicial')
        folio_final = request.POST.get('folio_final')

        existe_comprobante = Comprobante.objects.filter(
            comprobante__iexact=comprobante  # Ignora mayúsculas/minúsculas
        ).exists()

        if existe_comprobante:
            return JsonResponse({
                'status': False,
                'message': f'El comprobante "{comprobante}" ya existe.'
            }, status=400)
        else:
            nuevo_comprobante = Comprobante(
                comprobante=comprobante,
                serie=serie,
                folio_inicial=folio_inicial,
                folio_final=folio_final
            )
            nuevo_comprobante.save()

            return JsonResponse({
                'status': True,
                'message': f'Comprobante "{comprobante}" creado exitosamente.',
                'comprobante_id': nuevo_comprobante.id
            })
    
    return JsonResponse({
        'status': False,
        'message': 'Método no permitido'
    }, status=405)

def editar_comprobante(request):
    if request.method == 'POST':
        id_comprobante = request.POST.get('id_comprobante')
        comprobante = get_object_or_404(Comprobante, pk=id_comprobante)
        
        comprobante_data = {
            'id': comprobante.id,
            'comprobante': comprobante.comprobante,
            'serie': comprobante.serie,
            'folio_inicial': comprobante.folio_inicial,
            'folio_final': comprobante.folio_final
        }
        
        return JsonResponse({'status': True, 'message': 'Datos del comprobante obtenidos correctamente', 'comprobante': comprobante_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def mostrar_comprobante(request):
    if request.method == 'POST':
        id_comprobante = request.POST.get('id_comprobante')
        comprobante = get_object_or_404(Comprobante, pk=id_comprobante)
        
        comprobante_data = {
            'id': comprobante.id,
            'comprobante': comprobante.comprobante,
            'serie': comprobante.serie,
            'folio_inicial': comprobante.folio_inicial,
            'folio_final': comprobante.folio_final
        }
        
        return JsonResponse({'status': True, 'message': 'Datos del comprobante obtenidos correctamente', 'comprobante': comprobante_data})
    
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def actualizar_comprobante(request):
    if request.method == 'POST':
        id_comprobante = request.POST.get('id_comprobante')
        comprobante = get_object_or_404(Comprobante, pk=id_comprobante)
        
        comprobante.comprobante = request.POST.get('comprobante')
        comprobante.serie = request.POST.get('serie')
        comprobante.folio_inicial = request.POST.get('folio_inicial')
        comprobante.folio_final = request.POST.get('folio_final')
        
        comprobante.save()
        
        return JsonResponse({'status': True, 'message': 'Comprobante actualizada correctamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

def eliminar_comprobante(request):
    if request.method == 'POST':
        id_comprobante = request.POST.get('id_comprobante')
        comprobante = get_object_or_404(Comprobante, id=id_comprobante)
        comprobante.delete()
        return JsonResponse({'status': True, 'message': 'Comprobante eliminada exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)
