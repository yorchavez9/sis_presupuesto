from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import Presupuesto, Trabajador, EquipoMaquinaria
from django.views.decorators.csrf import csrf_exempt
import os, json
from django.utils import timezone
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

def index_presupuestos(request):
    return render(request, 'presupuestos/index.html')


@csrf_exempt
def mostrar_sueldo_trabajador(request):
    if request.method == 'POST':
        try:
            # Leer los datos JSON del cuerpo de la solicitud
            data = json.loads(request.body)
            trabajador_id = data.get('id_trabajador')
            tipo_sueldo = data.get('tipo_sueldo')
        except json.JSONDecodeError:
            return JsonResponse({'status': False, 'message': 'Datos JSON no válidos'}, status=400)

        # Validar que el tipo de sueldo sea uno de los permitidos
        tipos_sueldo_permitidos = ['diario', 'semanal', 'quincenal', 'mensual', 'proyecto']
        if tipo_sueldo not in tipos_sueldo_permitidos:
            return JsonResponse({'status': False, 'message': 'Tipo de sueldo no válido'}, status=400)

        # Obtener el trabajador
        trabajador = get_object_or_404(Trabajador, pk=trabajador_id)

        # Obtener el sueldo correspondiente según el tipo de sueldo
        sueldo = getattr(trabajador, f'sueldo_{tipo_sueldo}', None)
        if sueldo is None:
            return JsonResponse({'status': False, 'message': 'Tipo de sueldo no válido'}, status=400)

        # Construir la respuesta
        trabajador_data = {
            'id': trabajador.id,
            'sueldo': sueldo  # Solo devolvemos el sueldo correspondiente
        }

        return JsonResponse({'status': True, 'message': 'Datos del trabajador obtenidos correctamente', 'trabajador': trabajador_data})

    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def mostrar_sueldo_maquina(request):
    if request.method == 'POST':
        try:
            # Leer los datos JSON del cuerpo de la solicitud
            data = json.loads(request.body)
            maquina_id = data.get('id_maquina')
            tipo_sueldo = data.get('tipo_sueldo')
        except json.JSONDecodeError:
            return JsonResponse({'status': False, 'message': 'Datos JSON no válidos'}, status=400)

        # Validar que el tipo de sueldo sea uno de los permitidos
        tipos_sueldo_permitidos = ['hora', 'diario', 'semanal', 'quincenal', 'mensual', 'proyecto']
        if tipo_sueldo not in tipos_sueldo_permitidos:
            return JsonResponse({'status': False, 'message': 'Tipo de costo no válido'}, status=400)

        # Obtener el maquina
        maquina = get_object_or_404(EquipoMaquinaria, pk=maquina_id)

        # Obtener el sueldo correspondiente según el tipo de sueldo
        costo = getattr(maquina, f'costo_{tipo_sueldo}', None)
        if costo is None:
            return JsonResponse({'status': False, 'message': 'Tipo de costo no válido'}, status=400)

        # Construir la respuesta
        maquina_data = {
            'id': maquina.id,
            'costo': costo  # Solo devolvemos el sueldo correspondiente
        }

        return JsonResponse({'status': True, 'message': 'Datos obtenidos correctamente', 'maquina': maquina_data})

    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

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