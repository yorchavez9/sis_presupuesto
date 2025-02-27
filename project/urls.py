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
    path('material-servicio/', include('app.urls.material_servicio_urls')) 
]