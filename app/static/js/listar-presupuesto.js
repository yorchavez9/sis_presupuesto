$(document).ready(function () {

    function formatCurrency(value) {
        if (!value) return "S/ 0.00";
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
    }

    function cargarPresupuestos() {
        $.ajax({
            url: "lista-presupuestos/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                var tabla = $("#tabla_lista_presupuesto");
                var tbody = tabla.find("tbody");
                tbody.empty();
                response.presupuestos.forEach(function (dato, index) {
                    let fila = `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${dato.nombre_cliente}</td>
                                    <td>${dato.tipo_comprobante}</td>
                                    <td>${dato.descripcion}</td>
                                    <td>${dato.impuesto}</td>
                                    <td>${formatCurrency(dato.sub_total)}</td>
                                    <td>${formatCurrency(dato.total_impuesto)}</td>
                                    <td>${formatCurrency(dato.total)}</td>
                                    <td>${dato.fecha}</td>
                                    <td>
                                        ${dato.estado 
                                            ? `<button class="btn bg-success text-white btn-sm rounded btnActivar" idPresupuesto="${dato.id}" estadoPresupuesto="0">Activado</button>`
                                            : `<button class="btn bg-danger text-white btn-sm rounded btnActivar" idPresupuesto="${dato.id}" estadoPresupuesto="1">Desactivado</button>`}
                                    </td>
                                    <td>
                                        <div class="dropdown">
                                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="ri-more-2-fill"></i>
                                            </button>
                                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <li>
                                                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modal_editar_material_servicio">
                                                        <i class="ri-edit-box-line text-warning me-2 fs-4"></i> Editar
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item btnImprimirPresupuesto" href="#" idPresupuesto="${dato.id}">
                                                        <i class="ri-printer-line text-success me-2 fs-4"></i> Imprimir
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item btnDescargarPresupuesto" href="#" idPresupuesto="${dato.id}">
                                                        <i class="ri-download-line text-success me-2 fs-4"></i> Descargar
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modal_ver_material_servicio">
                                                        <i class="ri-eye-line text-primary me-2 fs-4"></i> Ver
                                                    </a>
                                                </li>
                                                <li>
                                                    <a class="dropdown-item confirm-text btnEliminarPresupuesto" href="#" idPresupuesto="${dato.id}">
                                                        <i class="ri-delete-bin-line text-danger me-2 fs-4"></i> Eliminar
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            `;
                            tbody.append(fila);
                });
    
                // Destruir DataTable si ya está inicializado
                if ($.fn.DataTable.isDataTable("#tabla_lista_presupuesto")) {
                    tabla.DataTable().destroy();
                }

                // Re-inicializar DataTables
                tabla.DataTable({
                    autoWidth: true,
                    responsive: true,
                });
            },
            error: function (error) {
                console.error("Error al cargar proveedores:", error);
            }
        });
    }
    cargarPresupuestos();



    /* =========================================
      ELIMINAR PRESUPUESTO
      ========================================= */
    $("#tabla_lista_presupuesto").on("click", '.btnEliminarPresupuesto', function (e) {
        e.preventDefault();
        let id_presupuesto = $(this).attr("idPresupuesto");
        const datos = new FormData();
        datos.append("id_presupuesto", id_presupuesto);
        Swal.fire({
            title: "¿Está seguro de borrar el presupuesto?",
            text: "¡Si no lo está puede cancelar la acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#6973E3",
            cancelButtonColor: "#FF4D4D",
            cancelButtonText: "Cancelar",
            confirmButtonText: "Si, borrar!",
        }).then(function (result) {
            if (result.value) {
                $.ajax({
                    url: "eliminar-presupuesto/",
                    type: 'POST',
                    data: datos,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.status) {
                            // Destruir la DataTable si ya está inicializada
                            if ($.fn.DataTable.isDataTable("#tabla_lista_presupuesto")) {
                                $("#tabla_lista_presupuesto").DataTable().destroy();
                            }

                            cargarPresupuestos();
                            Swal.fire({
                                title: "¡Eliminado!",
                                text: response.message,
                                icon: "success",
                            })
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: response.message,
                                icon: "error",
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        Swal.fire({
                            title: "Error",
                            text: "Ocurrió un error al eliminar el material o servicio.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });

    /* =========================================
      DESCARGAR COMPROBANTE PRESUPUESTO
      ========================================= */
      $("#tabla_lista_presupuesto").on("click", '.btnDescargarPresupuesto', function (e){
        e.preventDefault();
        let presupuesto_id = $(this).attr("idPresupuesto");
        const datos = new FormData();
        datos.append("presupuesto_id", presupuesto_id);
        window.open(`generar-pdf-comprobante/${presupuesto_id}/`, '_blank');
      });

    /* =========================================
      IMPRIMIR COMPROBANTE PRESUPUESTO
      ========================================= */
      $("#tabla_lista_presupuesto").on("click", '.btnImprimirPresupuesto', function (e) {
        e.preventDefault();
        let presupuesto_id = $(this).attr("idPresupuesto");
        let nuevaVentana = window.open(`generar-pdf-comprobante/${presupuesto_id}/`, '_blank');

        nuevaVentana.onload = function() {
          nuevaVentana.print();
        };
      });
    
})

