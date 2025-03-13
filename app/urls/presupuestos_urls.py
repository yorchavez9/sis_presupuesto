from django.urls import path
from app.views import presupuestos, clientes, comprobantes, material_servicio

urlpatterns = [
    path('', presupuestos.index_presupuestos, name='index_presupuestos'),
    path('lista-clientes/', clientes.lista_clientes, name='lista_clientes'),
    path('consultar-dni/<str:numero>/', clientes.consultar_dni, name='consultar_dni'),
    path('consultar-ruc/<str:numero>/', clientes.consulta_ruc, name='consulta_ruc'),
    path('crear-cliente/', clientes.crear_cliente, name='crear_cliente'),
    path('lista-comprobantes/', comprobantes.lista_comprobantes, name='lista_comprobantes'),
    path('lista-presupuestos/', presupuestos.lista_presupuesto, name='lista_presupuestos'),
    path('mostrar-serie-numero-comprobante/', comprobantes.mostrar_comprobante, name='mostrar_comprobante'),
    path('lista-materiales-servicios/', material_servicio.lista_materiales_servicios, name='mostrar_materiales')
]