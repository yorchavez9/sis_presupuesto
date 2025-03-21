from django.urls import path
from app.views import clientes  # Asegura que el módulo sea correcto

urlpatterns = [
    path('', clientes.index_reporte_clientes, name='index_clientes_reporte'),
    path('lista-clientes/', clientes.lista_clientes_reporte, name='lista_clientes'),
    path('generar-reporte-pdf/<str:desde_fecha>/<str:hasta_fecha>/', clientes.generar_reporte_pdf, name='generar_reporte_pdf'),
    path('generar-reporte-pdf/', clientes.generar_reporte_pdf, name='generar_reporte_pdf_sin_fechas'),
]
