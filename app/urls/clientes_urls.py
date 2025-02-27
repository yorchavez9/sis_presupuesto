from django.urls import path
from app.views import clientes

urlpatterns = [
    path('', clientes.index_clientes, name='index_clientes'),
    path('lista/', clientes.lista_clientes, name='lista_clientes'),
    path('crear/', clientes.crear_cliente, name='crear_cliente'),
    path('activar/', clientes.activar_cliente, name='activar_cliente'),
    path('eliminar/', clientes.eliminar_cliente, name='eliminar_cliente'),
    path('consultar-dni/<str:numero>/', clientes.consultar_dni, name='consultar_dni'),
    path('consultar-ruc/<str:numero>/', clientes.consulta_ruc, name='consulta_ruc'),
]