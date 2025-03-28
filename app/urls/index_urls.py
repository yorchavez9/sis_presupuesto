from django.urls import path, include
from ..views import views, usuarios, mensajes, clientes, material_servicio, presupuestos, trabajadores

urlpatterns = [
    path('', views.index, name='index'),
    path('signin/', views.signin, name='signin'),
    path('signup/', views.signup, name='signup'),
    path('signout/', views.signout, name='signout'),
    path('enviar-mensaje/', mensajes.crear_mensaje, name='crear_mensaje'),
    path('lista-mensajes/', mensajes.lista_mensajes, name='lista_mensajes'),
    
    # DATOS PARA EL DASHBOARD
    path('lista-clientes/', clientes.lista_clientes, name='lista_clientes'),
    path('lista-material-servicio/', material_servicio.lista_materiales_servicios, name='lista_material_servicio'),
    path('lista-presupuestos/', presupuestos.lista_presupuesto, name='lista_presupuestos'),
    path('lista-trabajadores/', trabajadores.lista_trabajadores, name='lista_trabajadores'),
    
    path('presupuestos-vs-real/', presupuestos.presupuestos_vs_real, name='presupuestos_vs_real'),
    path('materiales-mas-utilizados/', material_servicio.materiales_mas_utilizados, name='materiales_mas_utilizados'),
    
]