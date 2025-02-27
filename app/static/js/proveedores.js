$(document).ready(function () {

    let tabla = $('.tabla_proveedores').DataTable({
        "destroy": true,
        "responsive": true,
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    function cargarProveedores() {
        $.ajax({
            url: "lista/",
            type: 'GET',
            dataType: 'json',
            success: function (proveedores) {
                tabla.clear();
                proveedores.forEach(function (dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.tipo_documento,
                        dato.num_documento,
                        dato.razon_social,
                        dato.direccion || "Sin dirección",
                        dato.telefono || "Sin teléfono",
                        dato.correo || "Sin correo",
                        dato.tipo,
                        dato.estado ?
                            '<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idProveedor="' + dato.id + '" estadoProveedor="0">Activado</button>' :
                            '<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idProveedor="' + dato.id + '" estadoProveedor="1">Desactivado</button>',
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarProveedor" idProveedor="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_proveedor">
                            <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarProveedor" idProveedor="${dato.id}">
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

    $('#seccion_razon_social').hide();
    $('#tipo_documento').change(function () {
        let tipo_documento = $(this).val(); 
        if (tipo_documento === "DNI" || tipo_documento === "RUC") {
            $('#seccion_razon_social').show(); 
            if (tipo_documento === "DNI") {
                $('#razon_social').html('Nombre Completo <span class="text-danger">(*)</span>'); 
            } else if (tipo_documento === "RUC") {
                $('#razon_social').html('Razón Social <span class="text-danger">(*)</span>');
            }
        } else {
            $('#seccion_razon_social').hide();
        }
    });

    $('#btn_consultar_documento').click(async function (e) {
        e.preventDefault();
        let tipo_documento = $('#tipo_documento').val();
        let num_documento = $('#num_documento').val();
        if (tipo_documento == "DNI") {
            let datos = await obtenerDatosDNI(num_documento);
            if (datos && datos.nombreCompleto) {
                $('#razon_social').val(datos.nombreCompleto);
                $('#seccion_razon_social').show();
            }
        } else if (tipo_documento == "RUC") {
            let datos = await obtenerDatosRUC(num_documento);
            if (datos && datos.razonSocial) {
                $('#razon_social').val(datos.razonSocial);
                $('#direccion').val(datos.direccion);
                $('#seccion_razon_social').show();
            }
        }
    });

    $("#btn_guardar_proveedor").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let tipo_documento = $("#tipo_documento").val();
        let num_documento = $("#num_documento").val();
        let razon_social = $("#razon_social").val();
        let direccion = $("#direccion").val();
        let telefono = $("#telefono").val();
        let correo = $("#correo").val();
        let tipo = $("#tipo").val();

        if (tipo_documento == "" || tipo_documento == null) {
            $("#error_tipo_documento").html("Seleccione el tipo de documento");
            isValid = false;
        } else {
            $("#error_tipo_documento").html("");
        }

        if (num_documento == "" || num_documento == null) {
            $("#error_num_documento_proveedor").html("El número de documento es obligatorio");
            isValid = false;
        } else if (!/^\d+$/.test(num_documento)) {
            $("#error_num_documento_proveedor").html("El número de documento debe contener solo números");
            isValid = false;
        } else if (num_documento.length >= 15) {
            $("#error_num_documento_proveedor").html("El número de documento debe tener menos de 15 caracteres");
            isValid = false;
        } else {
            $("#error_num_documento_proveedor").html("");
        }

        if (razon_social == "" || razon_social == null) {
            $("#error_razon_social_proveedor").html("La razón social es obligatoria");
            isValid = false;
        } else {
            $("#error_razon_social_proveedor").html("");
        }

        if (tipo == "" || tipo == null) {
            $("#error_tipo").html("Seleccione el tipo de proveedor");
            isValid = false;
        } else {
            $("#error_tipo").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("tipo_documento", tipo_documento);
            datos.append("num_documento", num_documento);
            datos.append("razon_social", razon_social);
            datos.append("direccion", direccion);
            datos.append("telefono", telefono);
            datos.append("correo", correo);
            datos.append("tipo", tipo);

            $.ajax({
                url: "crear/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarProveedores();
                        tabla.destroy();
                        tabla = $('.tabla_proveedores').DataTable({
                            "destroy": true,
                            "responsive": true,
                            "pageLength": 10,
                            "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                            }
                        });
                        $("#modal_nuevo_proveedor").modal("hide");
                        $("#form_crear_proveedor")[0].reset();
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
                    console.error("Error al crear proveedor:", error);
                }
            })
        }
    });

    $(".tabla_proveedores").on("click", '.btnEditarProveedor', function (e) {
        e.preventDefault();
        let proveedor_id = $(this).attr("idProveedor");
        const datos = new FormData();
        datos.append("proveedor_id", proveedor_id);
        $.ajax({
            url: "editar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    $("#proveedor_id_edit").val(response.proveedor.id);
                    $("#tipo_documento_edit").val(response.proveedor.tipo_documento);
                    $("#num_documento_edit").val(response.proveedor.num_documento);
                    $("#razon_social_edit").val(response.proveedor.razon_social);
                    $("#direccion_edit").val(response.proveedor.direccion);
                    $("#telefono_edit").val(response.proveedor.telefono);
                    $("#correo_edit").val(response.proveedor.correo);
                    $("#tipo_edit").val(response.proveedor.tipo);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error) {
                console.error("Error al editar proveedor:", error);
            }
        })
    });

    $("#btn_editar_proveedor").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let proveedor_id = $("#proveedor_id_edit").val();
        let tipo_documento = $("#tipo_documento_edit").val();
        let num_documento = $("#num_documento_edit").val();
        let razon_social = $("#razon_social_edit").val();
        let direccion = $("#direccion_edit").val();
        let telefono = $("#telefono_edit").val();
        let correo = $("#correo_edit").val();
        let tipo = $("#tipo_edit").val();

        if (tipo_documento == "" || tipo_documento == null) {
            $("#error_tipo_documento_edit").html("Seleccione el tipo de documento");
            isValid = false;
        } else {
            $("#error_tipo_documento_edit").html("");
        }

        if (num_documento == "" || num_documento == null) {
            $("#error_num_documento_proveedor_edit").html("El número de documento es obligatorio");
            isValid = false;
        } else if (!/^\d+$/.test(num_documento)) {
            $("#error_num_documento_proveedor_edit").html("El número de documento debe contener solo números");
            isValid = false;
        } else if (num_documento.length >= 15) {
            $("#error_num_documento_proveedor_edit").html("El número de documento debe tener menos de 15 caracteres");
            isValid = false;
        } else {
            $("#error_num_documento_proveedor_edit").html("");
        }

        if (razon_social == "" || razon_social == null) {
            $("#error_razon_social_proveedor_edit").html("La razón social es obligatoria");
            isValid = false;
        } else {
            $("#error_razon_social_proveedor_edit").html("");
        }

        if (tipo == "" || tipo == null) {
            $("#error_tipo_edit").html("Seleccione el tipo de proveedor");
            isValid = false;
        } else {
            $("#error_tipo_edit").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("proveedor_id", proveedor_id);
            datos.append("tipo_documento", tipo_documento);
            datos.append("num_documento", num_documento);
            datos.append("razon_social", razon_social);
            datos.append("direccion", direccion);
            datos.append("telefono", telefono);
            datos.append("correo", correo);
            datos.append("tipo", tipo);

            $.ajax({
                url: "actualizar/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarProveedores();
                        $("#modal_editar_proveedor").modal("hide");
                        $("#form_editar_proveedor")[0].reset();
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

    $(".tabla_proveedores").on("click", '.btnActivar', function (e) {
        e.preventDefault();

        let proveedor_id = $(this).attr("idProveedor");
        let proveedor_estado = $(this).attr("estadoProveedor");

        const datos = new FormData();
        datos.append("proveedor_id", proveedor_id);
        datos.append("proveedor_estado", proveedor_estado);

        $.ajax({
            url: "activar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    cargarProveedores();
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
                    text: "Ocurrió un error al activar o desactivar el proveedor.",
                    icon: "error",
                });
                console.log(xhr);
                console.log(status);
                console.log(error);
            }
        });
    });

    $(".tabla_proveedores").on("click", '.btnEliminarProveedor', function (e) {
        e.preventDefault();
        let proveedor_id = $(this).attr("idProveedor");
        const datos = new FormData();
        datos.append("proveedor_id", proveedor_id);

        Swal.fire({
            title: "¿Está seguro de borrar el proveedor?",
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
                            cargarProveedores();
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
                            text: "Ocurrió un error al eliminar el proveedor.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });

});
