from django.db import models

class Cliente(models.Model):
    # Opciones para el campo 'tipo_documento'
    TIPO_DOCUMENTO_CHOICES = [
        ('DNI', 'Documento Nacional de Identidad'),
        ('RUC', 'Registro Único de Contribuyente'),
        ('PASAPORTE', 'Pasaporte'),
        ('OTRO', 'Otro'),
    ]

    tipo_documento = models.CharField(
        max_length=20,
        choices=TIPO_DOCUMENTO_CHOICES,
        verbose_name="Tipo de Documento"
    )
    num_documento = models.CharField(
        max_length=15,
        unique=True,
        verbose_name="Número de Documento"
    )
    nombre = models.CharField(
        max_length=150,
        verbose_name="Nombre Completo"
    )
    direccion = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name="Dirección"
    )
    telefono = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name="Teléfono"
    )
    correo = models.EmailField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name="Correo Electrónico"
    )
    estado = models.IntegerField(
        default=1,
        verbose_name="Estado"
    )
    fecha = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de Registro"
    )

    def __str__(self):
        return f"{self.nombre} ({self.num_documento})"

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        db_table = "clientes"  # Nombre de la tabla en la base de datos
        
class Categoria(models.Model):
    categoria = models.CharField(
        max_length=100,
        verbose_name="Categoría"
    )
    descripcion = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name="Descripción"
    )
    tipo = models.CharField(
        max_length=50,
        verbose_name="Tipo"  # Material o Servicio
    )
    fecha = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha de Registro"
    )

    def __str__(self):
        return self.categoria

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        db_table = "categorias"  # Nombre de la tabla en la base de datos