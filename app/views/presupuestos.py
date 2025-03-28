from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from django.core.serializers import serialize
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.exceptions import ObjectDoesNotExist
from django.template.loader import render_to_string
from weasyprint import HTML
from django.db.models import Sum



from ..models import (
    Presupuesto,
    Trabajador,
    EquipoMaquinaria,
    DetalleMetrosTerreno,
    DetallePresupuestoMaterial,
    DetallePresupuestoTrabajador,
    DetallePresupuestoEquipoMaquina,
    MaterialServicio,
)

from django.db.models import Count, Sum, Q
from datetime import datetime, timedelta
from django.db.models.functions import TruncMonth

import os
import json
from io import BytesIO

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
)
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter



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
            return JsonResponse({'status': False, 'message': 'No tiene costo para este tipo de pago'}, status=400)

        # Obtener el maquina
        maquina = get_object_or_404(EquipoMaquinaria, pk=maquina_id)

        # Obtener el sueldo correspondiente según el tipo de sueldo
        costo = getattr(maquina, f'costo_{tipo_sueldo}', None)
        if costo is None:
            return JsonResponse({'status': False, 'message': 'No tiene costo para este tipo de pago'}, status=400)

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
                
                """ material_obj = MaterialServicio.objects.get(id=material["id_material"])
                material_obj.stock -= material['cantidad']
                material_obj.save();
                 """
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

            return JsonResponse({'status': 'success', 'presupuesto_id': presupuesto.id, 'message': 'Presupuesto y detalles creados correctamente'})
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

@csrf_exempt
def generar_pdf_presupuesto(request, presupuesto_id):
    # Obtener el presupuesto
    presupuesto = Presupuesto.objects.get(id=presupuesto_id)

    # Crear un buffer para el PDF
    buffer = BytesIO()

    # Crear el PDF
    pdf = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []

    # Estilos
    styles = getSampleStyleSheet()

    # Título
    elements.append(Paragraph("COTIZACIÓN", styles['Title']))
    elements.append(Paragraph(f"Cotización N° {presupuesto.serie}-{presupuesto.numero}", styles['Normal']))
    elements.append(Paragraph(f"Fecha: {presupuesto.fecha}", styles['Normal']))
    elements.append(Paragraph(f"Cliente: {presupuesto.id_cliente.nombre}", styles['Normal']))
    elements.append(Paragraph(f"DNI: {presupuesto.id_cliente.num_documento}", styles['Normal']))

    # Espacio
    elements.append(Spacer(1, 12))

    # Precio terreno detalle
    elements.append(Paragraph("Precio terreno detalle", styles['Heading2']))

    # Tabla de terreno
    data_terreno = [["Item", "Medida de terreno m²", "Precio por m²", "Sub total"]]
    total_terreno = 0
    for i, terreno in enumerate(DetalleMetrosTerreno.objects.filter(id_presupuesto=presupuesto), start=1):
        data_terreno.append([str(i), terreno.medida, f"S/ {terreno.precio}", f"S/ {terreno.sub_total}"])
        total_terreno = terreno.sub_total
    data_terreno.append(["Total", "", "", f"S/ {total_terreno}"])

    # Ancho de las columnas (ajustado para ocupar todo el ancho de la hoja)
    col_widths = [50, 200, 150, 150]  # Ajusta estos valores según el contenido
    tabla_terreno = Table(data_terreno, colWidths=col_widths)
    tabla_terreno.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(tabla_terreno)

    # Espacio
    elements.append(Spacer(1, 12))

    # Materiales Servicios detalles
    elements.append(Paragraph("Materiales Servicios detalles", styles['Heading2']))

    # Tabla de materiales
    data_materiales = [["Item", "Materiales o servicios", "Cantidad", "Precio", "Sub total"]]
    total_materiales = 0
    for i, material in enumerate(DetallePresupuestoMaterial.objects.filter(id_presupuesto=presupuesto), start=1):
        data_materiales.append([str(i), material.id_material_servicio.nombre, material.cantidad, f"S/ {material.precio}", f"S/ {material.sub_total}"])
        total_materiales = total_materiales + material.sub_total
    data_materiales.append(["Total", "", "", "", f"S/ {total_materiales}"])

    # Ancho de las columnas (ajustado para ocupar todo el ancho de la hoja)
    col_widths = [50, 250, 80, 80, 90]  # Ajusta estos valores según el contenido
    tabla_materiales = Table(data_materiales, colWidths=col_widths)
    tabla_materiales.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(tabla_materiales)

    # Espacio
    elements.append(Spacer(1, 12))

    # Detalles trabajadores
    elements.append(Paragraph("Detalles trabajadores", styles['Heading2']))

    # Tabla de trabajadores
    data_trabajadores = [["Item", "Trabajador", "Especialidad", "Sueldo", "Tiempo", "Sub total"]]
    for i, trabajador in enumerate(DetallePresupuestoTrabajador.objects.filter(id_presupuesto=presupuesto), start=1):
        data_trabajadores.append([str(i), trabajador.id_trabajador.nombre, trabajador.id_trabajador.id_especialidad, f"S/ {trabajador.precio}", trabajador.tiempo, f"S/ {trabajador.sub_total}"])
    data_trabajadores.append(["Total", "", "", "", "", f"S/ {presupuesto.sub_total}"])

    # Ancho de las columnas (ajustado para ocupar todo el ancho de la hoja)
    col_widths = [50, 150, 120, 80, 60, 90]  # Ajusta estos valores según el contenido
    tabla_trabajadores = Table(data_trabajadores, colWidths=col_widths)
    tabla_trabajadores.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(tabla_trabajadores)

    # Espacio
    elements.append(Spacer(1, 12))

    # Detalles maquina equipos
    elements.append(Paragraph("Detalles maquina equipos", styles['Heading2']))

    # Tabla de máquinas/equipos
    data_maquinas = [["Item", "Máquina o equipo", "Tipo", "Sueldo", "Tiempo", "Sub total"]]
    for i, maquina in enumerate(DetallePresupuestoEquipoMaquina.objects.filter(id_presupuesto=presupuesto), start=1):
        data_maquinas.append([str(i), maquina.id_maquina_equipo.nombre, maquina.tipo_costo, f"S/ {maquina.precio}", maquina.tiempo, f"S/ {maquina.sub_total}"])
    data_maquinas.append(["Total", "", "", "", "", f"S/ {presupuesto.sub_total}"])

    # Ancho de las columnas (ajustado para ocupar todo el ancho de la hoja)
    col_widths = [50, 150, 120, 80, 60, 90]  # Ajusta estos valores según el contenido
    tabla_maquinas = Table(data_maquinas, colWidths=col_widths)
    tabla_maquinas.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(tabla_maquinas)

    # Espacio
    elements.append(Spacer(1, 12))

    # Totales
    elements.append(Paragraph(f"Sub total: S/ {presupuesto.sub_total}", styles['Heading2']))
    elements.append(Paragraph(f"IGV (18%): S/ {presupuesto.total_impuesto}", styles['Heading2']))
    elements.append(Paragraph(f"Total: S/ {presupuesto.total}", styles['Heading2']))

    # Mensaje final
    elements.append(Paragraph("Gracias por la cotización", styles['Normal']))

    # Construir el PDF
    pdf.build(elements)

    # Obtener el contenido del buffer
    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="presupuesto_{presupuesto.serie}_{presupuesto.numero}.pdf"'
    return response
    
@csrf_exempt
def generar_pdf_comprobante(request, presupuesto_id):
    # Obtener el presupuesto
    presupuesto = get_object_or_404(Presupuesto, id=presupuesto_id)

    # Obtener detalles de terreno
    detalles_terreno = DetalleMetrosTerreno.objects.filter(id_presupuesto=presupuesto)
    # Obtener detalles de materiales/servicios
    detalles_materiales = DetallePresupuestoMaterial.objects.filter(id_presupuesto=presupuesto)
    # Obtener detalles de trabajadores
    detalles_trabajadores = DetallePresupuestoTrabajador.objects.filter(id_presupuesto=presupuesto)
    # Obtener detalles de máquinas/equipos
    detalles_maquinas = DetallePresupuestoEquipoMaquina.objects.filter(id_presupuesto=presupuesto)
    
    # Calcular subtotales generales
    subtotal_terreno = detalles_terreno.aggregate(total=Sum('sub_total'))['total'] or 0
    subtotal_materiales = detalles_materiales.aggregate(total=Sum('sub_total'))['total'] or 0
    subtotal_trabajadores = detalles_trabajadores.aggregate(total=Sum('sub_total'))['total'] or 0
    subtotal_maquinas = detalles_maquinas.aggregate(total=Sum('sub_total'))['total'] or 0


    # Preparar el contexto para la plantilla
    contexto = {
        'presupuesto': presupuesto,
        'detalles_terreno': detalles_terreno,
        'detalles_materiales': detalles_materiales,
        'detalles_trabajadores': detalles_trabajadores,
        'detalles_maquinas': detalles_maquinas,
        'subtotal_terreno': subtotal_terreno,
        'subtotal_materiales': subtotal_materiales,
        'subtotal_trabajadores': subtotal_trabajadores,
        'subtotal_maquinas': subtotal_maquinas,
    }

    # Renderizar el template HTML con los datos
    html_string = render_to_string('presupuestos/comprobante_pdf.html', contexto)

    # Generar el PDF con WeasyPrint
    html = HTML(string=html_string, base_url=request.build_absolute_uri())
    pdf = html.write_pdf()

    # Devolver el PDF como respuesta
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="cotizacion_{presupuesto.serie}_{presupuesto.numero}.pdf"'
    return response

@csrf_exempt
def cambiar_estado_presupuesto(request):
    try:
        presupuesto_id = request.POST.get('id')
        nuevo_estado = request.POST.get('nuevo_estado')
        
        if not presupuesto_id or not nuevo_estado:
            return JsonResponse({'success': False, 'error': 'Datos incompletos'}, status=400)
        
        try:
            presupuesto = Presupuesto.objects.get(id=presupuesto_id)
        except Presupuesto.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Presupuesto no encontrado'}, status=404)
        
        # Validar que el estado sea válido (1, 2 o 3)
        if nuevo_estado not in ['1', '2', '3']:
            return JsonResponse({'success': False, 'error': 'Estado inválido'}, status=400)
        
        presupuesto.estado = nuevo_estado
        presupuesto.save()
        
        return JsonResponse({
            'success': True,
            'nuevo_estado': nuevo_estado,
            'nombre_estado': presupuesto.get_estado_display()
        })
        
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)



def presupuestos_vs_real(request):
    # Obtener los últimos 6 meses
    end_date = datetime.now()
    start_date = end_date - timedelta(days=180)  # 6 meses atrás

    # Agrupar por mes y estado
    datos = Presupuesto.objects.filter(
        fecha__range=[start_date, end_date]
    ).annotate(
        month=TruncMonth('fecha')
    ).values('month').annotate(
        total=Count('id'),
        aprobados=Count('id', filter=Q(estado='2')),
        monto_total=Sum('sub_total'),  # Cambiado de 'total' a 'sub_total'
        monto_aprobado=Sum('sub_total', filter=Q(estado='2'))  # Cambiado de 'total' a 'sub_total'
    ).order_by('month')

    # Preparar datos para el gráfico
    labels = [d['month'].strftime("%b %Y") for d in datos]
    proyectado = [d['total'] for d in datos]
    real = [d['aprobados'] for d in datos]

    return JsonResponse({
        'labels': labels,
        'proyectado': proyectado,
        'real': real,
        'monto_proyectado': [float(d['monto_total'] or 0) for d in datos],
        'monto_real': [float(d['monto_aprobado'] or 0) for d in datos]
    })
    

@csrf_exempt
def eliminar_presupuesto(request):
    if request.method == 'POST':
        id_presupuesto = request.POST.get('id_presupuesto')
        presupuesto = get_object_or_404(Presupuesto, id=id_presupuesto)
        presupuesto.delete()
        return JsonResponse({'status': True, 'message': 'Presupuesto eliminado exitosamente'})
    return JsonResponse({'status': False, 'message': 'Método no permitido'}, status=405)

