from django.urls import path
from app.views import clientes

urlpatterns = [
    path('', clientes.index_reporte_clientes, name='index_clientes_reporte'),
    path('lista-clientes/', clientes.lista_clientes, name='lista_clientes'),
]