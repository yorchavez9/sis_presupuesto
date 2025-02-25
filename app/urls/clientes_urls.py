from django.urls import path
from app.views import clientes

urlpatterns = [
    path('', clientes.index_clientes, name='index_clientes'),
    path('lista/', clientes.lista_clientes, name='lista_clientes'),
    path('crear/', clientes.crear_cliente, name='crear_cliente'),
    path('eliminar/', clientes.eliminar_cliente, name='eliminar_cliente'),
]