from django.urls import path
from app.views import presupuestos

urlpatterns = [
    path('', presupuestos.index_presupuestos, name='index_presupuestos'),
]