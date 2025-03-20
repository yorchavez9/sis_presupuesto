from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app.urls.index_urls')),
    path('usuarios/', include('app.urls.usuarios_urls')), 
    path('clientes/', include('app.urls.clientes_urls')), 
    path('categorias/', include('app.urls.categorias_urls')), 
    path('unidades-medida/', include('app.urls.unidad_medida_urls')),
    path('proveedores/', include('app.urls.proveedores_urls')),
    path('material-servicio/', include('app.urls.material_servicio_urls')), 
    path('especialidades/', include('app.urls.especialidades_urls')), 
    path('trabajadores/', include('app.urls.trabajadores_urls')), 
    path('equipos-maquinarias/', include('app.urls.equipos_maquinarias_urls')), 
    path('encargar-equipos-maquinarias/', include('app.urls.encargar_maquina_equipo_urls')), 
    path('comprobantes/', include('app.urls.comprobantes_urls')), 
    path('presupuestos/', include('app.urls.presupuestos_urls')), 
    path('reporte-clientes/', include('app.urls.reporte_clientes_url')), 
]