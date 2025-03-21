$(document).ready(function () {

    $('input').each(function () {
        // Guardar el valor por defecto
        $(this).data('default', $(this).val());
    }).focus(function () {
        // Limpiar el input solo si el valor es "0" o "0.00"
        if ($(this).val() === '0' || $(this).val() === '0.00') {
            $(this).val('');
        }
    }).blur(function () {
        // Restaurar el valor por defecto si el campo está vacío
        if ($(this).val() === '') {
            $(this).val($(this).data('default'));
        }
    });

    function formatCurrency(value) {
        if (!value) return "Sin sueldo";
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
    }

    let tabla = $('.tabla_equipos_maquinarias').DataTable({
        "destroy": true,
        "responsive": true,
        "scrollX": true,
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    function cargarEquiposMaquinarias() {
        $.ajax({
            url: "lista/",
            type: 'GET',
            dataType: 'json',
            success: function (equipos) {
                tabla.clear();
                equipos.forEach(function (dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.tipo,
                        dato.nombre,
                        dato.marca || "Sin marca",
                        dato.descripcion || "Sin descripción",
                        formatCurrency(dato.costo_hora) || "N/A",
                        formatCurrency(dato.costo_diario) || "N/A",
                        formatCurrency(dato.costo_semanal) || "N/A",
                        formatCurrency(dato.costo_quincenal) || "N/A",
                        formatCurrency(dato.costo_mensual) || "N/A",
                        formatCurrency(dato.costo_proyecto) || "N/A",
                        dato.estado ?
                            '<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idMaquinaria="' + dato.id + '" estadoMaquinaria="0">Activado</button>' :
                            '<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idMaquinaria="' + dato.id + '" estadoMaquinaria="1">Desactivado</button>',
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarEquipoMaquinaria" idEquipo="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_equipo_maquinaria">
                            <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarEquipoMaquinaria" idEquipo="${dato.id}">
                            <i class="ri-delete-bin-line text-danger fs-3"></i>
                            </a>
                        </div>
                        `
                    ]);
                });
                tabla.draw();
            }
        });
    }

    cargarEquiposMaquinarias();

    /* =========================================
    CREAR EQUIPO/MAQUINARIA
    ========================================= */
    $("#btn_guardar_equipo_maquinaria").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let tipo = $("#tipo").val();
        let nombre = $("#nombre").val();
        let marca = $("#marca").val();
        let descripcion = $("#descripcion").val();
        let costo_hora = $("#costo_hora").val();
        let costo_diario = $("#costo_diario").val();
        let costo_semanal = $("#costo_semanal").val();
        let costo_quincenal = $("#costo_quincenal").val();
        let costo_mensual = $("#costo_mensual").val();
        let costo_proyecto = $("#costo_proyecto").val();

        if (tipo == "" || tipo == null) {
            $("#error_tipo").html("El tipo es obligatorio");
            isValid = false;
        } else {
            $("#error_tipo").html("");
        }

        if (nombre == "" || nombre == null) {
            $("#error_nombre").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_nombre").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("tipo", tipo);
            datos.append("nombre", nombre);
            datos.append("marca", marca);
            datos.append("descripcion", descripcion);
            datos.append("costo_hora", costo_hora);
            datos.append("costo_diario", costo_diario);
            datos.append("costo_semanal", costo_semanal);
            datos.append("costo_quincenal", costo_quincenal);
            datos.append("costo_mensual", costo_mensual);
            datos.append("costo_proyecto", costo_proyecto);

            $.ajax({
                url: "crear/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarEquiposMaquinarias();
                        tabla.destroy();
                        tabla = $('.tabla_equipos_maquinarias').DataTable({
                            "destroy": true,
                            "responsive": true,
                            "pageLength": 10,
                            "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
                            }
                        });
                        $("#modal_nuevo_equipo_maquinaria").modal("hide");
                        $("#form_crear_equipo_maquinaria")[0].reset();
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
                    console.error("Error al crear equipo/maquinaria:", error);
                }
            })
        }
    });

    /* =========================================
    ACTIVAR O DESACTIVAR MAQUINARIAS
    ========================================= */
    $(".tabla_equipos_maquinarias").on("click", '.btnActivar', function (e) {
        e.preventDefault();

        let maquinaria_id = $(this).attr("idMaquinaria");
        let maquinaria_estado = $(this).attr("estadoMaquinaria");

        const datos = new FormData();
        datos.append("maquinaria_id", maquinaria_id);
        datos.append("maquinaria_estado", maquinaria_estado);

        $.ajax({
            url: "activar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    cargarEquiposMaquinarias();
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
    EDITAR EQUIPO/MAQUINARIA
    ========================================= */
    $(".tabla_equipos_maquinarias").on("click", '.btnEditarEquipoMaquinaria', function (e) {
        e.preventDefault();
        let equipo_id = $(this).attr("idEquipo");
        const datos = new FormData();
        datos.append("equipo_id", equipo_id);
        $.ajax({
            url: "editar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {

                if (response.status) {
                    $("#equipo_maquinaria_id_edit").val(response.equipo.id);
                    $("#edit_tipo").val(response.equipo.tipo);
                    $("#edit_nombre").val(response.equipo.nombre);
                    $("#edit_marca").val(response.equipo.marca);
                    $("#edit_descripcion").val(response.equipo.descripcion);
                    $("#edit_costo_hora").val(response.equipo.costo_hora);
                    $("#edit_costo_diario").val(response.equipo.costo_diario);
                    $("#edit_costo_semanal").val(response.equipo.costo_semanal);
                    $("#edit_costo_quincenal").val(response.equipo.costo_quincenal);
                    $("#edit_costo_mensual").val(response.equipo.costo_mensual);
                    $("#edit_costo_proyecto").val(response.equipo.costo_proyecto);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error) {
                console.error("Error al editar equipo/maquinaria:", error);
            }
        })
    });

    /* =========================================
    ACTUALIZAR EQUIPO/MAQUINARIA
    ========================================= */
    $("#btn_editar_equipo_maquinaria").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let equipo_id = $("#equipo_maquinaria_id_edit").val();
        let tipo = $("#edit_tipo").val();
        let nombre = $("#edit_nombre").val();
        let marca = $("#edit_marca").val();
        let descripcion = $("#edit_descripcion").val();
        let costo_hora = $("#edit_costo_hora").val();
        let costo_diario = $("#edit_costo_diario").val();
        let costo_semanal = $("#edit_costo_semanal").val();
        let costo_quincenal = $("#edit_costo_quincenal").val();
        let costo_mensual = $("#edit_costo_mensual").val();
        let costo_proyecto = $("#edit_costo_proyecto").val();

        if (tipo == "" || tipo == null) {
            $("#error_edit_tipo").html("El tipo es obligatorio");
            isValid = false;
        } else {
            $("#error_edit_tipo").html("");
        }

        if (nombre == "" || nombre == null) {
            $("#error_edit_nombre").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_edit_nombre").html("");
        }


        if (isValid) {
            const datos = new FormData();
            datos.append("equipo_id", equipo_id);
            datos.append("tipo", tipo);
            datos.append("nombre", nombre);
            datos.append("marca", marca);
            datos.append("descripcion", descripcion);
            datos.append("costo_hora", costo_hora);
            datos.append("costo_diario", costo_diario);
            datos.append("costo_semanal", costo_semanal);
            datos.append("costo_quincenal", costo_quincenal);
            datos.append("costo_mensual", costo_mensual);
            datos.append("costo_proyecto", costo_proyecto);

            $.ajax({
                url: "actualizar/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarEquiposMaquinarias();
                        $("#modal_editar_equipo_maquinaria").modal("hide");
                        $("#form_editar_equipo_maquinaria")[0].reset();
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
    ELIMINAR EQUIPO/MAQUINARIA
    ========================================= */
    $(".tabla_equipos_maquinarias").on("click", '.btnEliminarEquipoMaquinaria', function (e) {
        e.preventDefault();
        let equipo_id = $(this).attr("idEquipo");
        const datos = new FormData();
        datos.append("equipo_id", equipo_id);

        Swal.fire({
            title: "¿Está seguro de borrar el equipo/maquinaria?",
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
                            cargarEquiposMaquinarias();
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
                            text: "Ocurrió un error al eliminar el equipo/maquinaria.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });

});
