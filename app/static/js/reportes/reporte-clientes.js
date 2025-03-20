$(document).ready(function () {

    function cargarClientes() {
        $.ajax({
            url: "lista-clientes/",
            type: 'GET',
            dataType: 'json',
            success: function (clientes) {
                var tabla = $("#tabla_clientes_reporte");
                var tbody = tabla.find("tbody");
                tbody.empty();
                clientes.forEach(function (dato, index) {
                    var fila = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${dato.nombre}</td>
                            <td>${dato.tipo_documento}: ${dato.num_documento}</td>
                            <td>${dato.direccion || "Sin dirección"}</td>
                            <td>${dato.telefono || "Sin teléfono"}</td>
                            <td>${dato.correo || "Sin correo"}</td>
                            <td>
                                ${dato.estado ?
                            '<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idCliente="' + dato.id + '" estadoCliente="0">Activado</button>' :
                            '<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idCliente="' + dato.id + '" estadoCliente="1">Desactivado</button>'
                        }
                            </td>
                            <td class="text-center">
                                <div class="text-center">
                                    <a href="#" class="me-3 btnEditarCliente" idCliente="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_cliente">
                                        <i class="ri-edit-box-line text-warning fs-3"></i>
                                    </a>
                                    <a href="#" class="me-3 confirm-text btnEliminarCliente" idCliente="${dato.id}">
                                        <i class="ri-delete-bin-line text-danger fs-3"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    `;
                    tbody.append(fila);
                });
                if ($.fn.DataTable.isDataTable("#tabla_clientes_reporte")) {
                    tabla.DataTable().destroy();
                }
                tabla.DataTable({
                    autoWidth: true,
                    responsive: true,
                });
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar los clientes:", error);
                console.log(xhr);
                console.log(status);
            }
        });
    }
    cargarClientes();
})
