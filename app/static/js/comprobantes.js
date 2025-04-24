$(document).ready(function () {

     // Configuración global de AJAX para incluir CSRF
     $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url)) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    let tabla = $('.tabla_comprobantes').DataTable({
        "destroy": true,
        "responsive": true,
        "scrollX": true,
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });

    function cargarComprobantes() {
        $.ajax({
            url: "lista/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                tabla.clear();
                response.forEach(function (data, index) {
                    tabla.row.add([
                        index + 1,
                        data.comprobante,
                        data.serie,
                        data.folio_inicial,
                        data.folio_final,
                        data.fecha,
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarComprobante" idComprobante="${data.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_comprobante">
                            <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarComprobante" idComprobante="${data.id}">
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

    cargarComprobantes();

    /* =========================================
    CREAR COMPROBANTE
    ========================================= */
    $("#btn_guardar_comprobante").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let comprobante = $("#comprobante").val();
        let serie = $("#serie").val();
        let folio_inicial = $("#folio_inicial").val();
        let folio_final = $("#folio_final").val();

        if (comprobante == "" || comprobante == null) {
            $("#error_comprobante").html("El comprobante es obligatorio");
            isValid = false;
        } else {
            $("#error_comprobante").html("");
        }

        if (serie == "" || serie == null) {
            $("#error_serie").html("La serie es obligatorio");
            isValid = false;
        } else {
            $("#error_serie").html("");
        }

        if (folio_inicial == "" || folio_inicial == null) {
            $("#error_folio_inicial").html("El folio inicial es abligatorio");
            isValid = false;
        } else {
            $("#error_folio_inicial").html("");
        }

        if (folio_final == "" || folio_final == null) {
            $("#error_folio_final").html("El folio final es obligatorio");
            isValid = false;
        } else {
            $("#error_folio_final").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("csrfmiddlewaretoken", csrftoken); 
            datos.append("comprobante", comprobante.toUpperCase());
            datos.append("serie", serie);
            datos.append("folio_inicial", folio_inicial);
            datos.append("folio_final", folio_final);
            $.ajax({
                url: "crear/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarComprobantes();
                        $("#modal_nuevo_comprobantes").modal("hide");
                        $("#form_crear_comprobante")[0].reset();
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
                error: function (xhr) {
                    console.error("Error al crear comprobante:", xhr);
            
                    // Mostrar SweetAlert con el mensaje de error del servidor
                    let errorMessage = "Ocurrió un error inesperado.";
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    }
            
                    Swal.fire({
                        title: "¡Error!",
                        text: errorMessage,
                        icon: "error",
                    });
                }
            });
            
        }
    });

    /* =========================================
    EDITAR COMPROBANTE
    ========================================= */
    $(".tabla_comprobantes").on("click", '.btnEditarComprobante', function (e) {
        e.preventDefault();
        let id_comprobante = $(this).attr("idComprobante");
        const datos = new FormData();
        datos.append("csrfmiddlewaretoken", csrftoken); 
        datos.append("id_comprobante", id_comprobante);
        $.ajax({
            url: "editar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {

                if (response.status) {
                    $("#id_comprobante_edit").val(response.comprobante.id);
                    $("#comprobante_edit").val(response.comprobante.comprobante);
                    $("#serie_edit").val(response.comprobante.serie);
                    $("#folio_inicial_edit").val(response.comprobante.folio_inicial);
                    $("#folio_final_edit").val(response.comprobante.folio_final);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error) {
                console.error("Error al editar categoría:", error);
            }
        })
    });

    /* =========================================
    ACTUALIZAR COMPROBANTE
    ========================================= */
    $("#btn_actualizar_comprobante").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let id_comprobante = $("#id_comprobante_edit").val();
        let comprobante = $("#comprobante_edit").val();
        let serie = $("#serie_edit").val();
        let folio_inicial = $("#folio_inicial_edit").val();
        let folio_final = $("#folio_final_edit").val();

        if (comprobante == "" || comprobante == null) {
            $("#error_comprobante_edit").html("El comprobante es obligatorio");
            isValid = false;
        } else {
            $("#error_comprobante_edit").html("");
        }

        if (serie == "" || serie == null) {
            $("#error_serie_edit").html("La serie es obligatorio");
            isValid = false;
        } else {
            $("#error_serie_edit").html("");
        }

        if (folio_inicial == "" || folio_inicial == null) {
            $("#error_folio_inicial_edit").html("El folio inicial es abligatorio");
            isValid = false;
        } else {
            $("#error_folio_inicial_edit").html("");
        }

        if (folio_final == "" || folio_final == null) {
            $("#error_folio_final_edit").html("El folio final es obligatorio");
            isValid = false;
        } else {
            $("#error_folio_final_edit").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("csrfmiddlewaretoken", csrftoken); 
            datos.append("id_comprobante", id_comprobante);
            datos.append("comprobante", comprobante);
            datos.append("serie", serie);
            datos.append("folio_inicial", folio_inicial);
            datos.append("folio_final", folio_final);

            $.ajax({
                url: "actualizar/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarComprobantes();
                        $("#modal_editar_comprobante").modal("hide");
                        $("#form_editar_comprobante")[0].reset();
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
    ELIMINAR COMPROBANTE
    ========================================= */
    $(".tabla_comprobantes").on("click", '.btnEliminarComprobante', function (e) {
        e.preventDefault();
        let id_comprobante = $(this).attr("idComprobante");
        const datos = new FormData();
        datos.append("csrfmiddlewaretoken", csrftoken); 
        datos.append("id_comprobante", id_comprobante);

        Swal.fire({
            title: "¿Está seguro de borrar el comprobante?",
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
                            cargarComprobantes();
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
                            text: "Ocurrió un error al eliminar la categoría.",
                            icon: "error",
                        });
                    }
                });
            }
        });
    });

});
