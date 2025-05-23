# Generated by Django 5.0.12 on 2025-03-12 16:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0013_encargarmaquinaequipo'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Presupuesto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha', models.DateField(verbose_name='Fecha de registro')),
                ('hora', models.CharField(max_length=50, verbose_name='Hora de registro')),
                ('serie', models.CharField(max_length=20, verbose_name='Serie')),
                ('numero', models.IntegerField(verbose_name='Número')),
                ('impuesto', models.DecimalField(decimal_places=2, max_digits=10, null=True, verbose_name='Impuesto')),
                ('sub_total', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Subtotal')),
                ('total_impuesto', models.DecimalField(decimal_places=2, max_digits=10, null=True, verbose_name='Total impuesto')),
                ('total', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Total')),
                ('estado', models.CharField(choices=[('1', 'Pendiente'), ('2', 'Aprobado'), ('3', 'Rechazado')], default='1', max_length=30, verbose_name='Estado')),
                ('id_cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.cliente', verbose_name='Cliente')),
                ('id_usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Usuario')),
            ],
            options={
                'verbose_name': 'Presupuesto',
                'verbose_name_plural': 'Presupuestos',
                'db_table': 'presupuestos',
            },
        ),
    ]
