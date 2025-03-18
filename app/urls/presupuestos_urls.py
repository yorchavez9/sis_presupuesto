from django.urls import path
from app.views import presupuestos, clientes, comprobantes, material_servicio, trabajadores, equipos_maquinarias

urlpatterns = [
    path('', presupuestos.index_presupuestos, name='index_presupuestos'),
    path('lista-presupuesto-general', presupuestos.index_presupuestos_lista, name='index_presupuestos_lista'),
    path('lista-clientes/', clientes.lista_clientes, name='lista_clientes'),
    path('consultar-dni/<str:numero>/', clientes.consultar_dni, name='consultar_dni'),
    path('consultar-ruc/<str:numero>/', clientes.consulta_ruc, name='consulta_ruc'),
    path('crear-cliente/', clientes.crear_cliente, name='crear_cliente'),
    path('lista-comprobantes/', comprobantes.lista_comprobantes, name='lista_comprobantes'),
    
    path('obtener-ultimo-comprobante/', presupuestos.obtener_ultimo_comprobante, name='obtener_ultimo_comprobante'),
    path('ultimo-comprobante/', presupuestos.ultimo_comprobante, name='ultimo_comprobante_presupuesto'),
    
    path('mostrar-serie-numero-comprobante/', comprobantes.mostrar_comprobante, name='mostrar_comprobante'),
    path('lista-materiales-servicios/', material_servicio.lista_materiales_servicios, name='mostrar_materiales'),
    path('lista-trabajadores/', trabajadores.lista_trabajadores, name='lista_trabajadores'),
    path('trabajador-sueldo/', presupuestos.mostrar_sueldo_trabajador, name='mostrar_sueldo_trabajador'),
    path('maquina-sueldo/', presupuestos.mostrar_sueldo_maquina, name='mostrar_sueldo_maquina'),
    path('lista-equipos-maquinas/', equipos_maquinarias.lista_equipos_maquinarias, name='lista_equipos_maquinarias'),
    
    path('crear-presupuesto/', presupuestos.crear_presupuesto, name='crear_presupuesto'),
    path('lista-presupuestos/', presupuestos.lista_presupuesto, name='lista_presupuestos'),
    

]