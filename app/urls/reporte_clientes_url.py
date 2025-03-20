from django.urls import path
from app.views import clientes  # Asegura que el módulo sea correcto

urlpatterns = [
    path('', clientes.index_reporte_clientes, name='index_clientes_reporte'),
    path('lista-clientes/', clientes.lista_clientes_reporte, name='lista_clientes'),

]
