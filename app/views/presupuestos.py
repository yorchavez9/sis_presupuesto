from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from ..models import Presupuesto, Trabajador, EquipoMaquinaria,  DetalleMetrosTerreno, DetallePresupuestoMaterial, DetallePresupuestoTrabajador, DetallePresupuestoEquipoMaquina
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import os, json
from django.utils import timezone
from django.core.serializers import serialize
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.exceptions import ObjectDoesNotExist

def index_presupuestos(request):
    return render(request, 'presupuestos/index.html')

def index_presupuestos_lista(request):
    return render(request, 'presupuestos/lista.html')


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

@csrf_exempt
def lista_presupuesto(request):
    if request.method == 'GET':
        try:
            # Obtener todos los presupuestos con sus relaciones
            presupuestos = Presupuesto.objects.select_related('id_cliente', 'id_comprobante').all()

            # Formatear los datos para devolverlos en la respuesta
            response_data = []
            for presupuesto in presupuestos:
                presupuesto_info = {
                    'id': presupuesto.id,
                    'fecha': presupuesto.fecha.strftime('%Y-%m-%d'),  # Formatear fecha
                    'hora': presupuesto.hora,   # Formatear hora
                    'serie': presupuesto.serie,
                    'numero': presupuesto.numero,
                    'impuesto': float(presupuesto.impuesto),          # Convertir a float
                    'sub_total': float(presupuesto.sub_total),        # Convertir a float
                    'total_impuesto': float(presupuesto.total_impuesto),  # Convertir a float
                    'total': float(presupuesto.total),                # Convertir a float
                    'estado': presupuesto.estado,
                    'id_cliente': presupuesto.id_cliente.id,
                    'nombre_cliente': presupuesto.id_cliente.nombre,  # Nombre del cliente
                    'id_usuario': presupuesto.id_usuario.id,
                    'condicion_pago': presupuesto.condicion_pago,
                    'descripcion': presupuesto.descripcion,
                    'garantia': presupuesto.garantia,
                    'notas': presupuesto.notas,
                    'observacion': presupuesto.observacion,
                    'plazo_ejecucion': presupuesto.plazo_ejecucion,
                    'id_comprobante': presupuesto.id_comprobante.id,
                    'tipo_comprobante': presupuesto.id_comprobante.comprobante,  # Tipo de comprobante
                }
                response_data.append(presupuesto_info)

            # Devolver la respuesta en formato JSON
            return JsonResponse({'status': 'success', 'presupuestos': response_data}, safe=False)

        except Exception as e:
            # Manejar errores
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)
    
@csrf_exempt
def crear_presupuesto(request):
    if request.method == 'POST':
        try:
            # Obtener los datos del formulario
            id_usuario = request.POST.get('id_usuario')
            id_cliente = request.POST.get('id_cliente')
            id_comprobante = request.POST.get('id_comprobante')
            
            fecha = request.POST.get('fecha')
            hora = request.POST.get('hora')
            serie = request.POST.get('serie')
            numero = request.POST.get('numero')
            impuesto = request.POST.get('impuesto')
            descripcion = request.POST.get('descripcion')
            condicion_pago = request.POST.get('condicion_pago')
            plazo_ejecucion = request.POST.get('plazo_ejecucion')
            garantia = request.POST.get('garantia')
            nota = request.POST.get('nota')
            observacion = request.POST.get('observacion')
            sub_total = request.POST.get('sub_total')
            total_impuesto = request.POST.get('total_impuesto')
            total = request.POST.get('total')

            # Crear el objeto Presupuesto
            presupuesto = Presupuesto(
                id_usuario_id=id_usuario,  # Asignar el ID directamente
                id_cliente_id=id_cliente,  # Asignar el ID directamente
                fecha=fecha,
                hora=hora,
                id_comprobante_id=id_comprobante,  # Asignar el ID directamente
                serie=serie,
                numero=numero,
                impuesto=impuesto,
                descripcion=descripcion,
                condicion_pago=condicion_pago,
                plazo_ejecucion=plazo_ejecucion,
                garantia=garantia,
                notas=nota,
                observacion=observacion,
                sub_total=sub_total,
                total_impuesto=total_impuesto,
                total=total
            )
            presupuesto.save()

            # Guardar detalles de metros de terreno
            data_terreno = json.loads(request.POST.get('data_terreno', '[]'))
            for terreno in data_terreno:
                DetalleMetrosTerreno.objects.create(
                    id_presupuesto=presupuesto,
                    medida=terreno['medida_terreno'],
                    precio=terreno['precio_terreno'],
                    sub_total=terreno['sub_total_terreno']
                )

            # Guardar detalles de materiales
            data_materiales = json.loads(request.POST.get('data_materiales', '[]'))
            for material in data_materiales:
                DetallePresupuestoMaterial.objects.create(
                    id_presupuesto=presupuesto,
                    id_material_servicio_id=material['id_material'],
                    cantidad=material['cantidad'],
                    precio=material['precio'],
                    sub_total=material['sub_total']
                )

            # Guardar detalles de trabajadores
            data_trabajadores = json.loads(request.POST.get('data_trabajadores', '[]'))
            for trabajador in data_trabajadores:
                DetallePresupuestoTrabajador.objects.create(
                    id_presupuesto=presupuesto,
                    id_trabajador_id=trabajador['id_trabajador'],
                    tipo_sueldo=trabajador['tipo_sueldo'],
                    precio=trabajador['precio'],
                    tiempo=trabajador['tiempo'],
                    sub_total=trabajador['sub_total']
                )

            # Guardar detalles de equipos/máquinas
            data_maquinas_equipos = json.loads(request.POST.get('data_maquinas_equipos', '[]'))
            for maquina in data_maquinas_equipos:
                DetallePresupuestoEquipoMaquina.objects.create(
                    id_presupuesto=presupuesto,
                    id_maquina_equipo_id=maquina['id_equipo_maquina'],
                    tipo_costo=maquina['tipo_sueldo'],
                    precio=maquina['precio'],
                    tiempo=maquina['tiempo'],
                    sub_total=maquina['sub_total']
                )

            return JsonResponse({'status': 'success', 'message': 'Presupuesto y detalles creados correctamente'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    else:
        return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)

@csrf_exempt
def ultimo_comprobante(request):
    if request.method == 'GET':
        try:
            # Obtener el último registro usando el ORM de Django
            ultimo_presupuesto = Presupuesto.objects.latest('id')

            # Formatear los datos para devolverlos en la respuesta
            response_data = {
                'id_comprobante': ultimo_presupuesto.id_comprobante_id,
                'comprobante': ultimo_presupuesto.id_comprobante.comprobante,
                'serie': ultimo_presupuesto.serie,
                'numero': ultimo_presupuesto.numero,
            }

            # Devolver la respuesta en formato JSON
            return JsonResponse({'status': 'success', 'ultimo_comprobante': response_data}, safe=False)

        except ObjectDoesNotExist:
            # Manejar el caso en que no hay registros
            return JsonResponse({'status': 'error', 'message': 'No se encontraron registros'}, status=404)

        except Exception as e:
            # Manejar otros errores
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)
    
@csrf_exempt
def obtener_ultimo_comprobante(request):
    if request.method == 'POST':
        try:
            # Obtener el id_comprobante enviado desde el formulario
            id_comprobante = request.POST.get('id_comprobante')

            # Validar que se haya enviado un id_comprobante
            if not id_comprobante:
                return JsonResponse({'status': 'error', 'message': 'id_comprobante no proporcionado'}, status=400)

            # Verificar si hay registros para el id_comprobante especificado
            if not Presupuesto.objects.filter(id_comprobante_id=id_comprobante).exists():
                return JsonResponse({
                    'status': 'not_found',
                    'message': 'No hay registros para el comprobante especificado.'
                }, status=200)  # Puedes usar status 200 o 404 según tu preferencia

            # Obtener el último registro con el id_comprobante especificado
            ultimo_presupuesto = Presupuesto.objects.filter(id_comprobante_id=id_comprobante).latest('id')

            # Formatear la respuesta
            response_data = {
                'id_comprobante': ultimo_presupuesto.id_comprobante_id,
                'serie': ultimo_presupuesto.serie,
                'numero': ultimo_presupuesto.numero,
            }

            # Devolver la respuesta en formato JSON
            return JsonResponse({'status': 'success', 'ultimo_comprobante': response_data}, safe=False)

        except Exception as e:
            # Manejar otros errores
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)
    else:
        return JsonResponse({'status': 'error', 'message': 'Método no permitido'}, status=405)