from django.urls import path
from app.views import proveedores

urlpatterns = [
    path('', proveedores.index_proveedores, name='index_proveedores'),
    path('lista-proveedores/', proveedores.lista_proveedores, name='lista_proveedores'),
    path('crear-proveedor/', proveedores.crear_proveedor, name='crear_proveedor'),
    path('activar-proveedor/', proveedores.activar_proveedor, name='activar_proveedor'),
    path('editar-proveedor/', proveedores.editar_proveedor, name='editar_proveedor'),
    path('actualizar-proveedor/', proveedores.actualizar_proveedor, name='actualizar_proveedor'),
    path('eliminar-proveedor/', proveedores.eliminar_proveedor, name='eliminar_proveedor'),
    path('consultar-dni/<str:numero>/', proveedores.consultar_dni, name='consultar_dni'),
    path('consultar-ruc/<str:numero>/', proveedores.consulta_ruc, name='consulta_ruc'),
]