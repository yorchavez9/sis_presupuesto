from django.urls import path
from app.views import material_servicio

urlpatterns = [
    path('', material_servicio.index_materiales_servicios, name='index_materiales_servicios'),
]