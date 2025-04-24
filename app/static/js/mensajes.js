$(document).ready(function () {

    // Configuración global de AJAX para incluir CSRF
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url)) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    /* ===========================================
    FUNCION PARA FORMATEAR FECHAS
    =========================================== */
    function formatDate(dateString) {
        if (!dateString) return "Sin fecha";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    function cargarMensajes() {
        $.ajax({
            url: "lista/",
            type: 'GET',
            dataType: 'json',
            success: mensajes => {
                const tabla = $("#tabla_mensajes");
                const tbody = tabla.find("tbody");
                tbody.empty();

                mensajes.forEach((dato, index) => {
                    const leidoBtn = dato.leido ?
                        `<button class="btn bg-success text-white btn-sm rounded btnMarcarLeido" 
                         idMensaje="${dato.id}" estadoLeido="0">Leído</button>` :
                        `<button class="btn bg-danger text-white btn-sm rounded btnMarcarLeido" 
                         idMensaje="${dato.id}" estadoLeido="1">No Leído</button>`;

                    const fila = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${dato.nombre || "Sin nombre"}</td>
                            <td>${dato.correo || "Sin correo"}</td>
                            <td>${dato.telefono || "Sin teléfono"}</td>
                            <td>${dato.mensaje || "Sin mensaje"}</td>
                            <td>${formatDate(dato.fecha) || "Sin fecha"}</td>
                            <td>${leidoBtn}</td>
                            <td>
                                <div class="text-center">
                                    <a href="#" class="me-3 btnVerMensaje" idMensaje="${dato.id}" 
                                       data-bs-toggle="modal" data-bs-target="#modal_ver_mensaje">
                                        <i class="ri-eye-line text-primary fs-3"></i>
                                    </a>
                                    <a href="#" class="me-3 btnEliminarMensaje" idMensaje="${dato.id}">
                                        <i class="ri-delete-bin-line text-danger fs-3"></i>
                                    </a>
                                </div>
                            </td>
                        </tr>
                    `;
                    tbody.append(fila);
                });

                if ($.fn.DataTable.isDataTable(tabla)) {
                    tabla.DataTable().destroy();
                }

                tabla.DataTable({
                    responsive: true,
                    autoWidth: false
                });
            }
        });
    }

    cargarMensajes();

    // Función para agregar un mensaje
    $("#form_agregar_mensaje").submit(function (e) {
        e.preventDefault();
        const datos = {
            csrfmiddlewaretoken: csrftoken,
            nombre: $("#agregar_nombre").val(),
            correo: $("#agregar_correo").val(),
            telefono: $("#agregar_telefono").val(),
            fecha: $("#agregar_fecha").val(),
            mensaje: $("#agregar_mensaje").val(),
        };

        $.ajax({
            url: "crear/",
            type: 'POST',
            data: JSON.stringify(datos),
            contentType: 'application/json',
            success: function (response) {
                if (response.status) {
                    if ($.fn.DataTable.isDataTable("#tabla_mensajes")) {
                        $("#tabla_mensajes").DataTable().destroy();
                    }
                    cargarMensajes();
                    $("#modal_agregar_mensaje").modal("hide");
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
                console.error("Error al agregar mensaje:", error);
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al agregar el mensaje.",
                    icon: "error",
                });
            }
        });
    });

    $("#tabla_mensajes").on("click", '.btnVerMensaje', function (e) {
        e.preventDefault();
        let mensaje_id = $(this).attr("idMensaje");

        $.ajax({
            url: `ver/${mensaje_id}/`,
            type: 'GET',
            success: function (response) {
                if (response.status) {
                    $("#ver_nombre").text(response.mensaje.nombre);
                    $("#ver_correo").text(response.mensaje.correo);
                    $("#ver_telefono").text(response.mensaje.telefono);
                    $("#ver_fecha").text(response.mensaje.fecha);
                    $("#ver_mensaje").text(response.mensaje.mensaje);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error) {
                console.error("Error al obtener mensaje:", error);
            }
        });
    });


    $("#tabla_mensajes").on("click", '.btnMarcarLeido', function (e) {
        e.preventDefault();
        let mensaje_id = $(this).attr("idMensaje");
        let estadoLeido = $(this).attr("estadoLeido");

        $.ajax({
            url: `marcar-leido/${mensaje_id}/`,
            type: 'POST',
            data: JSON.stringify({ leido: estadoLeido }),
            contentType: 'application/json',
            success: function (response) {
                if (response.status) {
                    if ($.fn.DataTable.isDataTable("#tabla_mensajes")) {
                        $("#tabla_mensajes").DataTable().destroy();
                    }
                    cargarMensajes();
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
                console.error("Error al marcar como leído/no leído:", error);
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al cambiar el estado del mensaje.",
                    icon: "error",
                });
            }
        });
    });


    $("#tabla_mensajes").on("click", '.btnEliminarMensaje', function (e) {
        e.preventDefault();
        let mensaje_id = $(this).attr("idMensaje");

        Swal.fire({
            title: "¿Está seguro de borrar el mensaje?",
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
                    url: `eliminar/${mensaje_id}/`,
                    type: 'DELETE',
                    data: {
                        'csrfmiddlewaretoken': csrftoken
                    },
                    success: function (response) {
                        if (response.status) {
                            if ($.fn.DataTable.isDataTable("#tabla_mensajes")) {
                                $("#tabla_mensajes").DataTable().destroy();
                            }
                            cargarMensajes();
                            Swal.fire({
                                title: "¡Eliminado!",
                                text: response.message,
                                icon: "success",
                            });
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: response.message,
                                icon: "error",
                            });
                        }
                    },
                    error: function (error) {
                        Swal.fire({
                            title: "Error",
                            text: "Ocurrió un error al eliminar el mensaje.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });
});
