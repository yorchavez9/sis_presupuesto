$(document).ready(function () {

    function formatCurrency(value) {
        if (!value) return "S/ 0.00";
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
    }


    function inicializarTabla() {
        return $('#tabla_lista_presupuesto').DataTable({
            "destroy": true,
            "responsive": true,
            "pageLength": 10,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }
        });
    }

    let tabla = inicializarTabla();

    function cargarProveedores() {
        $.ajax({
            url: "lista-presupuestos/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                tabla.clear();
                response.presupuestos.forEach(function (dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.nombre_cliente,
                        dato.tipo_comprobante,
                        dato.descripcion,
                        dato.impuesto,
                        formatCurrency(dato.sub_total),
                        formatCurrency(dato.total_impuesto),
                        formatCurrency(dato.total),
                        dato.fecha,
                        dato.estado ?
                            '<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idPresupuesto="' + dato.id + '" estadoPresupuesto="0">Activado</button>' :
                            '<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idPresupuesto="' + dato.id + '" estadoPresupuesto="1">Desactivado</button>',
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarPresupuesto" idPresupuesto="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_material_servicio">
                                <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 btnVerPresupuesto" idPresupuesto="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_ver_material_servicio">
                                <i class="ri-eye-line text-primary fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarPresupuesto" idPresupuesto="${dato.id}">
                                <i class="ri-delete-bin-line text-danger fs-3"></i>
                            </a>
                        </div>
                        `
                    ]);
                });
                tabla.draw();

            },
            error: function (error) {
                console.error("Error al cargar proveedores:", error);
            }
        });
    }
    cargarProveedores();
})