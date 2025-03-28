from django.urls import path
from app.views import mensajes

urlpatterns = [
    # URLs para Mensajes
    path('', mensajes.index_mensaje, name='index_mensaje'),
    path('lista/', mensajes.lista_mensajes, name='lista_mensajes'),
    path('obtener/<int:mensaje_id>/', mensajes.obtener_mensaje, name='obtener_mensaje'),
    path('marcar-leido/<int:mensaje_id>/', mensajes.marcar_como_leido, name='marcar_como_leido'),
    path('eliminar/<int:mensaje_id>/', mensajes.eliminar_mensaje, name='eliminar_mensaje'),
    path('ver/<int:mensaje_id>/', mensajes.ver_mensaje, name='ver_mensaje'),  # Para ver un mensaje
    path('crear/', mensajes.crear_mensaje, name='crear_mensaje'),  # Para crear un mensaje
]