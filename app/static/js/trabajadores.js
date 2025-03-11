$(document).ready(function () {

    
    function formatCurrency(value) {
        if (!value) return "Sin sueldo";
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
    }

    $('input').each(function () {
        $(this).data('default', $(this).val());
    }).focus(function () {
        $(this).val('');
    }).blur(function () {
        if ($(this).val() === '') {
            $(this).val($(this).data('default'));
        }
    });

    let tablaTrabajadores = $('.tabla_trabajadores').DataTable({
        "destroy": true,
        "responsive": true,
        "scrollX": true,
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    function cargarTrabajadores() {
        $.ajax({
            url: "lista-trabajadores/",
            type: 'GET',
            dataType: 'json',
            success: function (trabajadores) {
                tablaTrabajadores.clear();
                trabajadores.forEach(function (dato, index) {
                    tablaTrabajadores.row.add([
                        index + 1,
                        `${dato.nombre}<br>${dato.tipo_documento}: ${dato.num_documento}`,
                        dato.especialidad.especialidad || "Sin especialidad",
                        dato.tiempo_contrato || "Sin tiempo de contrato",
                        dato.sueldo_diario ? `${formatCurrency(dato.sueldo_diario)}` : "Sin sueldo diario",
                        dato.sueldo_semanal ? `${formatCurrency(dato.sueldo_semanal)}` : "Sin sueldo semanal",
                        dato.sueldo_quincenal ? `${formatCurrency(dato.sueldo_quincenal)}` : "Sin sueldo quincenal",
                        dato.sueldo_mensual ? `${formatCurrency(dato.sueldo_mensual)}` : "Sin sueldo mensual",
                        dato.sueldo_proyecto ? `${formatCurrency(dato.sueldo_proyecto)}` : "Sin sueldo proyecto",
                        dato.estado ?
                            '<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idTrabajador="' + dato.id + '" estadoTrabajador="0">Activado</button>' :
                            '<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idTrabajador="' + dato.id + '" estadoTrabajador="1">Desactivado</button>',
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarTrabajador" idTrabajador="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_trabajador">
                            <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarTrabajador" idTrabajador="${dato.id}">
                            <i class="ri-delete-bin-line text-danger fs-3"></i>
                            </a>
                        </div>
                        `
                    ]);
                });
                tablaTrabajadores.draw();
            }
        });
    }

    cargarTrabajadores();


    function lista_especialidades(){
        $.ajax({
            url: "lista-especialidades/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                $("#id_especialidad").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_especialidad").append(`<option value="${data.id}">${data.especialidad}</option>`);
                });
                $("#id_especialidad_edit").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_especialidad_edit").append(`<option value="${data.id}">${data.especialidad}</option>`);
                });
            },
            error: function (error) {
                console.error("Error al cargar categorias:", error);
            }
        });
    }

    lista_especialidades()

    $('#btn_guardar_trabajador').click(function (e) {
        e.preventDefault();
        let isValid = true;

        let tipo_documento = $("#tipo_documento").val();
        let num_documento = $("#num_documento").val();
        let nombre = $("#nombre").val();
        let id_especialidad = $("#id_especialidad").val();
        let tiempo_contrato = $("#tiempo_contrato").val();
        let sueldo_diario = $("#sueldo_diario").val();
        let sueldo_semanal = $("#sueldo_semanal").val();
        let sueldo_quincenal = $("#sueldo_quincenal").val();
        let sueldo_mensual = $("#sueldo_mensual").val();
        let sueldo_proyecto = $("#sueldo_proyecto").val();

        if (tipo_documento == "" || tipo_documento == null) {
            $("#error_tipo_documento").html("Seleccione el tipo de documento");
            isValid = false;
        } else {
            $("#error_tipo_documento").html("");
        }

        if (num_documento == "" || num_documento == null) {
            $("#error_num_documento_trabajador").html("El número de documento es obligatorio");
            isValid = false;
        } else if (!/^\d+$/.test(num_documento)) {
            $("#error_num_documento_trabajador").html("El número de documento debe contener solo números");
            isValid = false;
        } else if (num_documento.length >= 15) {
            $("#error_num_documento_trabajador").html("El número de documento debe tener menos de 15 caracteres");
            isValid = false;
        } else {
            $("#error_num_documento_trabajador").html("");
        }

        if (nombre == "" || nombre == null) {
            $("#error_nombre_trabajador").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_nombre_trabajador").html("");
        }

        if (id_especialidad == "" || id_especialidad == null) {
            $("#error_id_especialidad").html("Seleccione la especialidad");
            isValid = false;
        } else {
            $("#error_id_especialidad").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("tipo_documento", tipo_documento);
            datos.append("num_documento", num_documento);
            datos.append("nombre", nombre);
            datos.append("id_especialidad", id_especialidad);
            datos.append("tiempo_contrato", tiempo_contrato);
            datos.append("sueldo_diario", sueldo_diario);
            datos.append("sueldo_semanal", sueldo_semanal);
            datos.append("sueldo_quincenal", sueldo_quincenal);
            datos.append("sueldo_mensual", sueldo_mensual);
            datos.append("sueldo_proyecto", sueldo_proyecto);

            $.ajax({
                url: "crear-trabajador/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarTrabajadores();
                        $("#modal_nuevo_trabajador").modal("hide");
                        $("#form_crear_trabajador")[0].reset();
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
                    console.error("Error al crear trabajador:", error);
                }
            })
        }
    });

    $(".tabla_trabajadores").on("click", '.btnEditarTrabajador', function (e) {
        e.preventDefault();
        let trabajador_id = $(this).attr("idTrabajador");
        const datos = new FormData();
        datos.append("trabajador_id", trabajador_id);
        $.ajax({
            url: "editar-trabajador/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {

                if (response.status) {
                    $("#trabajador_id_edit").val(response.trabajador.id);
                    $("#tipo_documento_edit").val(response.trabajador.tipo_documento);
                    $("#num_documento_edit").val(response.trabajador.num_documento);
                    $("#nombre_edit").val(response.trabajador.nombre);
                    $("#id_especialidad_edit").val(response.trabajador.id_especialidad);
                    $("#tiempo_contrato_edit").val(response.trabajador.tiempo_contrato);
                    $("#sueldo_diario_edit").val(response.trabajador.sueldo_diario);
                    $("#sueldo_semanal_edit").val(response.trabajador.sueldo_semanal);
                    $("#sueldo_quincenal_edit").val(response.trabajador.sueldo_quincenal);
                    $("#sueldo_mensual_edit").val(response.trabajador.sueldo_mensual);
                    $("#sueldo_proyecto_edit").val(response.trabajador.sueldo_proyecto);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error) {
                console.error("Error al editar trabajador:", error);
            }
        })
    });

    $("#btn_editar_trabajador").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let trabajador_id = $("#trabajador_id_edit").val();
        let tipo_documento = $("#tipo_documento_edit").val();
        let num_documento = $("#num_documento_edit").val();
        let nombre = $("#nombre_edit").val();
        let id_especialidad = $("#id_especialidad_edit").val();
        let tiempo_contrato = $("#tiempo_contrato_edit").val();
        let sueldo_diario = $("#sueldo_diario_edit").val();
        let sueldo_semanal = $("#sueldo_semanal_edit").val();
        let sueldo_quincenal = $("#sueldo_quincenal_edit").val();
        let sueldo_mensual = $("#sueldo_mensual_edit").val();
        let sueldo_proyecto = $("#sueldo_proyecto_edit").val();

        if (tipo_documento == "" || tipo_documento == null) {
            $("#error_tipo_documento_edit").html("Seleccione el tipo de documento");
            isValid = false;
        } else {
            $("#error_tipo_documento_edit").html("");
        }

        if (num_documento == "" || num_documento == null) {
            $("#error_num_documento_trabajador_edit").html("El número de documento es obligatorio");
            isValid = false;
        } else if (!/^\d+$/.test(num_documento)) {
            $("#error_num_documento_trabajador_edit").html("El número de documento debe contener solo números");
            isValid = false;
        } else if (num_documento.length >= 15) {
            $("#error_num_documento_trabajador_edit").html("El número de documento debe tener menos de 15 caracteres");
            isValid = false;
        } else {
            $("#error_num_documento_trabajador_edit").html("");
        }

        if (nombre == "" || nombre == null) {
            $("#error_nombre_trabajador_edit").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_nombre_trabajador_edit").html("");
        }

        if (id_especialidad == "" || id_especialidad == null) {
            $("#error_id_especialidad_edit").html("Seleccione la especialidad");
            isValid = false;
        } else {
            $("#error_id_especialidad_edit").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("trabajador_id", trabajador_id);
            datos.append("tipo_documento", tipo_documento);
            datos.append("num_documento", num_documento);
            datos.append("nombre", nombre);
            datos.append("id_especialidad", id_especialidad);
            datos.append("tiempo_contrato", tiempo_contrato);
            datos.append("sueldo_diario", sueldo_diario);
            datos.append("sueldo_semanal", sueldo_semanal);
            datos.append("sueldo_quincenal", sueldo_quincenal);
            datos.append("sueldo_mensual", sueldo_mensual);
            datos.append("sueldo_proyecto", sueldo_proyecto);

            $.ajax({
                url: "actualizar-trabajador/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarTrabajadores();
                        $("#modal_editar_trabajador").modal("hide");
                        $("#form_editar_trabajador")[0].reset();
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
                    console.error("Error al actualizar trabajador:", error);
                }
            })
        }
    });

    $(".tabla_trabajadores").on("click", '.btnActivar', function (e) {
        e.preventDefault();

        let trabajador_id = $(this).attr("idTrabajador");
        let trabajador_estado = $(this).attr("estadoTrabajador");

        const datos = new FormData();
        datos.append("trabajador_id", trabajador_id);
        datos.append("trabajador_estado", trabajador_estado);

        $.ajax({
            url: "activar-trabajador/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    cargarTrabajadores();
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
                    text: "Ocurrió un error al activar o desactivar el trabajador.",
                    icon: "error",
                });
                console.log(xhr);
                console.log(status);
                console.log(error);
            }
        });
    });

    $(".tabla_trabajadores").on("click", '.btnEliminarTrabajador', function (e) {
        e.preventDefault();
        let trabajador_id = $(this).attr("idTrabajador");
        const datos = new FormData();
        datos.append("trabajador_id", trabajador_id);

        Swal.fire({
            title: "¿Está seguro de borrar el trabajador?",
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
                    url: "eliminar-trabajador/",
                    type: 'POST',
                    data: datos,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response.status) {
                            cargarTrabajadores();
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
                            text: "Ocurrió un error al eliminar el trabajador.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });

});
