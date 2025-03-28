$(document).ready(function () {


    function cargarClientes() {
        $.ajax({
            url: "lista-clientes/",
            type: 'GET',
            dataType: 'json',
            success: function (clientes) {
                var tabla = $("#tabla_clientes");
                var tbody = tabla.find("tbody");
                tbody.empty(); // Limpiar el contenido actual del tbody
    
                // Agregar los nuevos datos
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
    
                // Destruir DataTable si ya está inicializado
                if ($.fn.DataTable.isDataTable("#tabla_clientes")) {
                    tabla.DataTable().destroy();
                }
    
                // Re-inicializar DataTables
                tabla.DataTable({
                    autoWidth: true,
                    responsive: true,
                });
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar los clientes:", error);
            }
        });
    }
    
    // Cargar clientes al inicio
    cargarClientes();

    /* ===========================================
    OBTNER DATOS DEL DNI
    =========================================== */
    async function obtenerDatosDNI(numeroDNI) {
        try {
            const url = `consultar-dni/${numeroDNI}/`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            const datos = await response.json();
            return datos;
        } catch (error) {
            console.error('Error detallado:', {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
            if (error instanceof TypeError) {
                console.error('Posible problema de conexión. Verifica el servidor.');
            }
        }
    }

    /* ===========================================
    OBTNER DATOS DEL RUC
    =========================================== */
    async function obtenerDatosRUC(numeroRUC) {
        try {
            const url = `consultar-ruc/${numeroRUC}/`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            const datos = await response.json();
            return datos;
        } catch (error) {
            console.error('Error detallado:', {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
            if (error instanceof TypeError) {
                console.error('Posible problema de conexión. Verifica el servidor.');
            }
        }
    }

    /* ===========================================
    SELECIONANDO EL TIPO DE DOCUMENTO
    =========================================== */
    $('#seccion_nombre').hide();
    $('#tipo_documento').change(function () {
        let tipo_documento = $(this).val();
        if (tipo_documento === "DNI" || tipo_documento === "RUC") {
            $('#seccion_nombre').show();
            if (tipo_documento === "DNI") {
                $('#nombre_razon_social').html('Nombre Completo <span class="text-danger">(*)</span>');
            } else if (tipo_documento === "RUC") {
                $('#nombre_razon_social').html('Razón Social <span class="text-danger">(*)</span>');
            }
        } else {
            $('#seccion_nombre').hide();
        }
    });


    $('#btn_consultar_documento').click(async function (e) {
        e.preventDefault();
        let tipo_documento = $('#tipo_documento').val();
        let num_documento = $('#num_documento').val();
        if (tipo_documento == "DNI") {
            let datos = await obtenerDatosDNI(num_documento);
            if (datos && datos.nombreCompleto) {
                $('#nombre').val(datos.nombreCompleto);
                $('#section_nombre').show();
            }
        } else if (tipo_documento == "RUC") {
            let datos = await obtenerDatosRUC(num_documento);
            if (datos && datos.razonSocial) {
                $('#nombre').val(datos.razonSocial);
                $('#direccion').val(datos.direccion);
                $('#section_nombre').show();
            }
        }
    });

    /* =========================================
    CREAR CLIENTE
    ========================================= */
    $("#btn_guardar_cliente").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let tipo_documento = $("#tipo_documento").val();
        let num_documento = $("#num_documento").val();
        let nombre = $("#nombre").val();
        let direccion = $("#direccion").val();
        let telefono = $("#telefono").val();
        let correo = $("#correo").val();

        if (tipo_documento == "" || tipo_documento == null) {
            $("#error_tipo_documento").html("Selecione el tipo de documento");
            isValid = false;
        } else {
            $("#error_tipo_documento").html("");
        }

        if (num_documento == "" || num_documento == null) {
            $("#error_num_documento_cliente").html("El número de documento es obligatorio");
            isValid = false;
        } else if (!/^\d+$/.test(num_documento)) {
            $("#error_num_documento_cliente").html("El número de documento debe contener solo números");
            isValid = false;
        } else if (num_documento.length >= 15) {
            $("#error_num_documento_cliente").html("El número de documento debe tener menos de 15 caracteres");
            isValid = false;
        } else {
            $("#error_num_documento_cliente").html("");
        }

        if (nombre == "" || nombre == null) {
            $("#error_nombre_cliente").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_nombre_cliente").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("tipo_documento", tipo_documento);
            datos.append("num_documento", num_documento);
            datos.append("nombre", nombre);
            datos.append("direccion", direccion);
            datos.append("telefono", telefono);
            datos.append("correo", correo);

            $.ajax({
                url: "crear-cliente/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        if ($.fn.DataTable.isDataTable("#tabla_clientes")) {
                            $("#tabla_clientes").DataTable().destroy();
                        }
                        cargarClientes();
                        $("#modal_nuevo_cliente").modal("hide");
                        $("#form_crear_cliente")[0].reset();
                        Swal.fire({
                            title: "¡Correcto!",
                            text: response.message,
                            icon: "success",
                        });
                    } else {
                        Swal.fire({
                            title: "¡Error!",
                            text: response.message,
                            icon: "error",
                        });
                    }
                },
                error: function (error) {
                    Swal.fire({
                        title: "¡Error!",
                        text: error.responseJSON ? error.responseJSON.message : "Ocurrió un error inesperado.",
                        icon: "error",
                    });
                }
            });
        }
    });

    /* =========================================
    EDITAR CLIENTE
    ========================================= */
    $("#tabla_clientes").on("click", '.btnEditarCliente', function (e) {
        e.preventDefault();
        let cliente_id = $(this).attr("idCliente");
        const datos = new FormData();
        datos.append("cliente_id", cliente_id);
        $.ajax({
            url: "editar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    $("#cliente_id_edit").val(response.cliente.id);
                    $("#tipo_documento_edit").val(response.cliente.tipo_documento);
                    $("#num_documento_edit").val(response.cliente.num_documento);
                    $("#nombre_edit").val(response.cliente.nombre);
                    $("#direccion_edit").val(response.cliente.direccion);
                    $("#telefono_edit").val(response.cliente.telefono);
                    $("#correo_edit").val(response.cliente.correo);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error) {
                console.error("Error al editar usuario:", error);
            }
        })
    });

    /* =========================================
    ACTUALIZAR CLIENTE
    ========================================= */
    $("#btn_editar_cliente").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let cliente_id = $("#cliente_id_edit").val();
        let tipo_documento = $("#tipo_documento_edit").val();
        let num_documento = $("#num_documento_edit").val();
        let nombre = $("#nombre_edit").val();
        let direccion = $("#direccion_edit").val();
        let telefono = $("#telefono_edit").val();
        let correo = $("#correo_edit").val();

        if (tipo_documento == "" || tipo_documento == null) {
            $("#error_tipo_documento_edit").html("Selecione el tipo de documento");
            isValid = false;
        } else {
            $("#error_tipo_documento_edit").html("");
        }

        if (num_documento == "" || num_documento == null) {
            $("#error_num_documento_cliente_edit").html("El número de documento es obligatorio");
            isValid = false;
        } else if (!/^\d+$/.test(num_documento)) {
            $("#error_num_documento_cliente_edit").html("El número de documento debe contener solo números");
            isValid = false;
        } else if (num_documento.length >= 15) {
            $("#error_num_documento_cliente_edit").html("El número de documento debe tener menos de 15 caracteres");
            isValid = false;
        } else {
            $("#error_num_documento_cliente_edit").html("");
        }

        if (nombre == "" || nombre == null) {
            $("#error_nombre_cliente_edit").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_nombre_cliente_edit").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("cliente_id", cliente_id);
            datos.append("tipo_documento", tipo_documento);
            datos.append("num_documento", num_documento);
            datos.append("nombre", nombre);
            datos.append("direccion", direccion);
            datos.append("telefono", telefono);
            datos.append("correo", correo);

            $.ajax({
                url: "actualizar/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        // Destruir la DataTable si ya está inicializada
                        if ($.fn.DataTable.isDataTable("#tabla_clientes")) {
                            $("#tabla_clientes").DataTable().destroy();
                        }

                        // Cargar los clientes nuevamente
                        cargarClientes();
                
                        $("#modal_editar_cliente").modal("hide");
                        $("#form_editar_cliente")[0].reset();
                        Swal.fire({
                            title: "¡Correcto!",
                            text: response.message,
                            icon: "success",
                        });
                    } else {
                        Swal.fire({
                            title: "¡Error!",
                            text: response.message,
                            icon: "error",
                        });
                    }
                }
                
            })
        }
    });

    /* =========================================
    ACTIVAR O DESACTIVAR CLIENTE
    ========================================= */
    $("#tabla_clientes").on("click", '.btnActivar', function (e) {
        e.preventDefault();

        let cliente_id = $(this).attr("idCliente");
        let cliente_estado = $(this).attr("estadoCliente");

        const datos = new FormData();
        datos.append("cliente_id", cliente_id);
        datos.append("cliente_estado", cliente_estado);

        $.ajax({
            url: "activar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    if ($.fn.DataTable.isDataTable("#tabla_clientes")) {
                        $("#tabla_clientes").DataTable().destroy();
                    }
                    cargarClientes();
                    Swal.fire({
                        title: "¡Correcto!",
                        text: response.message,
                        icon: "success",
                    });
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (xhr, status, error) {
                Swal.fire({
                    title: "¡Error!",
                    text: "Ocurrió un error al activar o desactivar el usuario.",
                    icon: "error",
                });
                console.log(xhr);
                console.log(status);
                console.log(error);
            }
        });
    });

    /* =========================================
    ELIMINAR CLIENTE
    ========================================= */
    $("#tabla_clientes").on("click", '.btnEliminarCliente', function (e) {
        e.preventDefault();
        let cliente_id = $(this).attr("idCliente");
        const datos = new FormData();
        datos.append("cliente_id", cliente_id);

        Swal.fire({
            title: "¿Está seguro de borrar el usuario?",
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
                    url: "eliminar/",
                    type: 'POST',
                    data: datos,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.status) {
                            // Destruir la DataTable si ya está inicializada
                            if ($.fn.DataTable.isDataTable("#tabla_clientes")) {
                                $("#tabla_clientes").DataTable().destroy();
                            }

                            // Cargar los clientes nuevamente
                            cargarClientes();
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
                            text: "Ocurrió un error al eliminar el usuario.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });

});
