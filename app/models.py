from django.db import models
from django.conf import settings  # Para referenciar el modelo de usuario de Django

class Cliente(models.Model):
    # Opciones para el campo 'tipo_documento'
    TIPO_DOCUMENTO_CHOICES = [
        ("DNI", "Documento Nacional de Identidad"),
        ("RUC", "Registro Único de Contribuyente"),
        ("PASAPORTE", "Pasaporte"),
        ("OTRO", "Otro"),
    ]

    tipo_documento = models.CharField(
        max_length=20, choices=TIPO_DOCUMENTO_CHOICES, verbose_name="Tipo de Documento"
    )
    num_documento = models.CharField(
        max_length=15, unique=True, verbose_name="Número de Documento"
    )
    nombre = models.CharField(max_length=150, verbose_name="Nombre Completo")
    direccion = models.CharField(
        max_length=200, null=True, blank=True, verbose_name="Dirección"
    )
    telefono = models.CharField(
        max_length=20, null=True, blank=True, verbose_name="Teléfono"
    )
    correo = models.EmailField(
        max_length=100, null=True, blank=True, verbose_name="Correo Electrónico"
    )
    estado = models.IntegerField(default=1, verbose_name="Estado")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    def __str__(self):
        return f"{self.nombre} ({self.num_documento})"

    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        db_table = "clientes"  # Nombre de la tabla en la base de datos

class Categoria(models.Model):
    categoria = models.CharField(max_length=100, verbose_name="Categoría")
    descripcion = models.CharField(
        max_length=200, null=True, blank=True, verbose_name="Descripción"
    )
    tipo = models.CharField(max_length=50, verbose_name="Tipo")  # Material o Servicio
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    def __str__(self):
        return self.categoria

    class Meta:
        verbose_name = "Categoría"
        verbose_name_plural = "Categorías"
        db_table = "categorias"  # Nombre de la tabla en la base de datos

class UnidadMedida(models.Model):
    unidad = models.CharField(max_length=50, verbose_name="Unidad de Medida")
    descripcion = models.CharField(
        max_length=200, null=True, blank=True, verbose_name="Descripción"
    )
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    def __str__(self):
        return self.unidad

    class Meta:
        verbose_name = "Unidad de Medida"
        verbose_name_plural = "Unidades de Medida"
        db_table = "unidades_medida"  # Nombre de la tabla en la base de datos

class Proveedor(models.Model):
    TIPO_DOCUMENTO_CHOICES = [
        ("DNI", "Documento Nacional de Identidad"),
        ("RUC", "Registro Único de Contribuyente"),
        ("PASAPORTE", "Pasaporte"),
        ("OTRO", "Otro"),
    ]

    tipo_documento = models.CharField(
        max_length=20, choices=TIPO_DOCUMENTO_CHOICES, verbose_name="Tipo de Documento"
    )
    num_documento = models.CharField(max_length=15, verbose_name="Número de Documento")
    razon_social = models.CharField(max_length=150, verbose_name="Razón Social")
    direccion = models.CharField(
        max_length=200, null=True, blank=True, verbose_name="Dirección"
    )
    telefono = models.CharField(
        max_length=15, null=True, blank=True, verbose_name="Teléfono"
    )
    correo = models.EmailField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name="Correo Electrónico",
    )

    class Meta:
        unique_together = ('correo',)
    tipo = models.CharField(
        max_length=50, verbose_name="Tipo"  # Materiales o Servicios
    )
    estado = models.IntegerField(default=1, verbose_name="Estado")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    def __str__(self):
        return self.razon_social

    class Meta:
        verbose_name = "Proveedor"
        verbose_name_plural = "Proveedores"
        db_table = "proveedores"  # Nombre de la tabla en la base de datos

class MaterialServicio(models.Model):
    id_proveedor = models.ForeignKey(
        Proveedor, on_delete=models.CASCADE, verbose_name="Proveedor"
    )
    id_categoria = models.ForeignKey(
        Categoria, on_delete=models.CASCADE, verbose_name="Categoría"
    )
    tipo = models.CharField(max_length=50, verbose_name="Tipo")  # Material o Servicio
    nombre = models.CharField(max_length=150, verbose_name="Nombre")
    marca = models.CharField(max_length=50, null=True, blank=True, verbose_name="Marca")
    id_unidad_medida = models.ForeignKey(
        UnidadMedida, on_delete=models.CASCADE, verbose_name="Unidad de Medida"
    )
    precio_compra = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Precio de Compra"
    )
    precio_venta = models.DecimalField(
        max_digits=10, decimal_places=2, verbose_name="Precio de Venta"
    )
    stock = models.IntegerField(verbose_name="Stock")
    stock_minimo = models.IntegerField(verbose_name="Stock Mínimo")
    imagen = models.CharField(
        max_length=100, null=True, blank=True, verbose_name="Imagen"
    )
    descripcion = models.TextField(null=True, blank=True, verbose_name="Descripción")
    estado = models.IntegerField(default=1, verbose_name="Estado")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Material o Servicio"
        verbose_name_plural = "Materiales o Servicios"
        db_table = "materiales_servicios"  # Nombre de la tabla en la base de datos
        
class Tareas(models.Model):
    nombre = models.CharField(max_length=50)  

class Regalo(models.Model):
    nombre = models.CharField(max_length=100, verbose_name="Nombre del Regalo")
    precio = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Precio")
    descripcion = models.TextField(null=True, blank=True, verbose_name="Descripción")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Regalo"
        verbose_name_plural = "Regalos"
        db_table = "regalos"  # Nombre de la tabla en la base de datos
        
class Especialidad(models.Model):
    especialidad = models.CharField(max_length=150, verbose_name="Especialidad")
    funcion = models.TextField(verbose_name="Función")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    def __str__(self):
        return self.especialidad

    class Meta:
            verbose_name = "Especialidad"
            verbose_name_plural = "Especialidades"
            db_table = "especialidades"  # Nombre de la tabla en la base de datos
        
class Trabajador(models.Model):
            TIPO_DOCUMENTO_CHOICES = [
                ("DNI", "Documento Nacional de Identidad"),
                ("RUC", "Registro Único de Contribuyente"),
                ("PASAPORTE", "Pasaporte"),
                ("OTRO", "Otro"),
            ]

            tipo_documento = models.CharField(
                max_length=20, choices=TIPO_DOCUMENTO_CHOICES, verbose_name="Tipo de Documento"
            )
            num_documento = models.CharField(max_length=15, verbose_name="Número de Documento")
            nombre = models.CharField(max_length=150, verbose_name="Nombre Completo")
            id_especialidad = models.ForeignKey(
                Especialidad, on_delete=models.CASCADE, verbose_name="Especialidad"
            )
            tiempo_contrato = models.CharField(max_length=150, verbose_name="Tiempo de Contrato")
            sueldo_diario = models.DecimalField(
                max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Sueldo Diario"
            )
            sueldo_semanal = models.DecimalField(
                max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Sueldo Semanal"
            )
            sueldo_quincenal = models.DecimalField(
                max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Sueldo Quincenal"
            )
            sueldo_mensual = models.DecimalField(
                max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Sueldo Mensual"
            )
            sueldo_proyecto = models.DecimalField(
                max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Sueldo Proyecto"
            )
            estado = models.IntegerField(default=1, verbose_name="Estado")
            fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

            def __str__(self):
                return self.nombre

            class Meta:
                verbose_name = "Trabajador"
                verbose_name_plural = "Trabajadores"
                db_table = "trabajadores"  # Nombre de la tabla en la base de datos
                
class EquipoMaquinaria(models.Model):
    tipo = models.CharField(max_length=50, verbose_name="Tipo")  # Maquinaria o Equipo
    nombre = models.CharField(max_length=150, verbose_name="Nombre")
    marca = models.CharField(max_length=150, null=True, blank=True, verbose_name="Marca")
    descripcion = models.TextField(null=True, blank=True, verbose_name="Descripción")
    costo_hora = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Costo por Hora")
    costo_diario = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Costo Diario")
    costo_semanal = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Costo Semanal")
    costo_quincenal = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Costo Quincenal")
    costo_mensual = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Costo Mensual")
    costo_proyecto = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, verbose_name="Costo Proyecto")
    estado = models.IntegerField(default=1, verbose_name="Estado")
    fecha = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de Registro")

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Equipo o Maquinaria"
        verbose_name_plural = "Equipos o Maquinarias"
        db_table = "equipos_maquinarias"  # Nombre de la tabla en la base de datos
        
class EncargarMaquinaEquipo(models.Model):
    id_trabajador = models.ForeignKey(Trabajador, on_delete=models.CASCADE, verbose_name='Trabajador')
    id_equipo_maquina = models.ForeignKey(EquipoMaquinaria, on_delete=models.CASCADE, verbose_name='Equipos Maquinarias')
    descripcion = models.TextField(null=True, blank=True, verbose_name='Descripción')
    fecha = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de registro')
    
    def __str__(self):
        return self.descripcion
    
    class Meta:
        verbose_name = "Encargo maquina equipo"
        verbose_name_plural = "Encargar máquinas y equipos"
        db_table = "encargar_maquina_equipo"
        
class Comprobante(models.Model):
    comprobante = models.CharField(max_length=50, verbose_name="Comprobante", blank=True, null=True)
    serie = models.CharField(max_length=20, verbose_name="Serie", null=False)
    folio_inicial = models.IntegerField(verbose_name="Folio Inicial", null=False)
    folio_final = models.IntegerField(verbose_name="Folio Final", null=False)
    fecha = models.DateTimeField(verbose_name="Fecha", auto_now_add=True)

    def __str__(self):
        return f"{self.comprobante} - {self.serie} ({self.folio_inicial} al {self.folio_final})"

    class Meta:
        verbose_name = "Comprobante"
        verbose_name_plural = "Comprobantes"
        db_table = "comprobantes"

class Presupuesto(models.Model):
    id_usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Usuario")
    id_cliente = models.ForeignKey('Cliente', on_delete=models.CASCADE, verbose_name="Cliente")
    fecha = models.DateField(verbose_name="Fecha de registro")
    hora = models.CharField(max_length=50, verbose_name="Hora de registro")
    serie = models.CharField(max_length=20, verbose_name="Serie")
    numero = models.IntegerField(verbose_name="Número")
    impuesto = models.DecimalField(max_digits=10, decimal_places=2, null=True, verbose_name="Impuesto")
    sub_total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Subtotal")
    total_impuesto = models.DecimalField(max_digits=10, decimal_places=2, null=True, verbose_name="Total impuesto")
    total = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Total")
    
    ESTADO_CHOICES = [
        ('1', 'Pendiente'),
        ('2', 'Aprobado'),
        ('3', 'Rechazado'),
    ]
    
    descripcion = models.TextField(verbose_name="Descripción", blank=True, null=True)
    condicion_pago = models.CharField(max_length=100, verbose_name="Condición de pago", blank=True, null=True)
    plazo_ejecucion = models.CharField(max_length=100, verbose_name="Plazo de ejecución", blank=True, null=True)
    garantia = models.CharField(max_length=100, verbose_name="Garantía", blank=True, null=True)
    notas = models.TextField(verbose_name="Notas", blank=True, null=True)
    observacion = models.CharField(max_length=50, verbose_name="Observación", blank=True, null=True)
    
    estado = models.CharField(max_length=30, choices=ESTADO_CHOICES, default='1', verbose_name="Estado")
    
    def __str__(self):
        return f"Presupuesto {self.serie}-{self.numero} ({self.fecha})"
    
    class Meta:
        verbose_name = "Presupuesto"
        verbose_name_plural = "Presupuestos"
        db_table = "presupuestos"
        
