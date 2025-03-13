from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import Presupuesto
from django.views.decorators.csrf import csrf_exempt
import os
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

def index_presupuestos(request):
    return render(request, 'presupuestos/index.html')


def lista_presupuesto(request):
    if request.method == 'GET':
        try:
            # Obtener todos los presupuestos ordenados por ID de manera descendente
            presupuestos = Presupuesto.objects.all().order_by('-id')
            
            # Lista para almacenar los datos de los presupuestos
            presupuestos_data = []
            
            # Recorrer cada presupuesto
            for presupuesto in presupuestos:
                # Obtener datos relacionados (cliente, usuario, comprobante)
                cliente = presupuesto.id_cliente
                usuario = presupuesto.id_usuario
                comprobante = presupuesto.id_comprobante
                
                # Crear el diccionario con los datos del presupuesto
                item = {
                    'id': presupuesto.id,
                    'fecha': presupuesto.fecha.strftime('%Y-%m-%d') if presupuesto.fecha else None,
                    'hora': presupuesto.hora.strftime('%H:%M:%S') if presupuesto.hora else None,
                    'serie': presupuesto.serie,
                    'numero': presupuesto.numero,
                    'impuesto': str(presupuesto.impuesto) if presupuesto.impuesto else None,
                    'sub_total': str(presupuesto.sub_total) if presupuesto.sub_total else None,
                    'total_impuesto': str(presupuesto.total_impuesto) if presupuesto.total_impuesto else None,
                    'total': str(presupuesto.total) if presupuesto.total else None,
                    'estado': presupuesto.estado,
                    'id_cliente': {
                        'id': cliente.id,
                        'nombre': cliente.nombre if cliente else None
                    } if cliente else None,
                    'id_usuario': {
                        'id': usuario.id,
                    } if usuario else None,
                    'condicion_pago': presupuesto.condicion_pago,
                    'descripcion': presupuesto.descripcion,
                    'garantia': presupuesto.garantia,
                    'notas': presupuesto.notas,
                    'observacion': presupuesto.observacion,
                    'plazo_ejecucion': presupuesto.plazo_ejecucion,
                    'id_comprobante': {
                        'id': comprobante.id,
                        'nombre': comprobante.comprobante if comprobante else None
                    } if comprobante else None,
                }
                # Agregar el diccionario a la lista
                presupuestos_data.append(item)
            
            # Devolver la lista de presupuestos como JSON
            return JsonResponse(presupuestos_data, safe=False)
        
        except Exception as e:
            # Manejar errores
            print(f"Error en la vista lista_presupuesto: {str(e)}")
            return JsonResponse({'error': 'Error interno del servidor'}, status=500)
    
    # Si el método no es GET, devolver un error
    return JsonResponse({'error': 'Método no permitido'}, status=405)