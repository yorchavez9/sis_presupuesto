$(document).ready(function () {
    function inicializarTabla() {
        return $('.tabla_materiales_servicios').DataTable({
            "destroy": true,
            "responsive": true, // Habilita el modo responsive
            "scrollX": true, // Permite el desplazamiento horizontal
            "pageLength": 10,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }
        });
    }

    let tabla = inicializarTabla();

    function cargarMaterialesServicios() {
        $.ajax({
            url: "lista-materiales-servicios/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                console.log(response);
                tabla.clear();
                response.forEach(function (dato, index) {
                    tabla.row.add([
                        index + 1,
                        dato.id_categoria.nombre,
                        dato.nombre,
                        dato.tipo,
                        dato.id_proveedor.nombre,
                        dato.id_unidad_medida.nombre,
                        dato.precio_compra,
                        dato.precio_venta,
                        dato.stock,
                        dato.stock_minimo,
                        dato.estado ?
                            '<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idCliente="' + dato.id + '" estadoCliente="0">Activado</button>' :
                            '<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idCliente="' + dato.id + '" estadoCliente="1">Desactivado</button>',
                        `
                        <div class="text-center">
                            <a href="#" class="me-3 btnEditarMaterialServicio" idMaterialServicio="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_editar_material_servicio">
                                <i class="ri-edit-box-line text-warning fs-3"></i>
                            </a>
                            <a href="#" class="me-3 btnEditarMaterialServicio" idMaterialServicio="${dato.id}" data-bs-toggle="modal" data-bs-target="#modal_ver_material_servicio">
                                <i class="ri-eye-line text-primary fs-3"></i>
                            </a>
                            <a href="#" class="me-3 confirm-text btnEliminarMaterialServicio" idMaterialServicio="${dato.id}">
                                <i class="ri-delete-bin-line text-danger fs-3"></i>
                            </a>
                        </div>
                        `
                    ]);
                });
                tabla.draw();
            },
            error: function (error) {
                console.error("Error al cargar materiales o servicios:", error);
            }
        });
    }

    cargarMaterialesServicios();

    // Detectar cambios de sección o navegación en el sidebar
    $(document).on('click', '.sidebar-link', function () {
        // Aquí puedes agregar lógica para detectar la sección actual y recargar la tabla correspondiente
        tabla.destroy();
        tabla = inicializarTabla();
        cargarMaterialesServicios();
    });

    /* =========================================
    LISTA DE PROVEEDORES
    ========================================= */
    function cargarProveedores() {
        $.ajax({
            url: "lista-proveedores/",
            type: 'GET',
            dataType: 'json',
            success: function (proveedores) {
                $("#id_proveedor").append('<option value="" disabled selected>Seleccionar</option>');
                proveedores.forEach(function (proveedor) {
                    $("#id_proveedor").append(`<option value="${proveedor.id}">${proveedor.razon_social}</option>`);
                });
            },
            error: function (error) {
                console.error("Error al cargar proveedores:", error);
            }
        });
    }
    cargarProveedores();

    /* =========================================
    LISTA DE CATEGORIAS
    ========================================= */
    function cargarCategorias() {
        $.ajax({
            url: "lista-categorias/",
            type: 'GET',
            dataType: 'json',
            success: function (categorias) {
                $("#id_categoria").append('<option value="" disabled selected>Seleccionar</option>');
                categorias.forEach(function (categoria) {
                    $("#id_categoria").append(`<option value="${categoria.id}">${categoria.categoria}</option>`);
                });
            },
            error: function (error) {
                console.error("Error al cargar categorias:", error);
            }
        });
    }
    cargarCategorias();

    /* =========================================
    LISTA UNIDAD MEDIDA
    ========================================= */
    function listaUnidadesMedidas() {
        $.ajax({
            url: "lista-unidades-medida/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                $("#id_unidad_medida").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_unidad_medida").append(`<option value="${data.id}">${data.unidad}</option>`);
                });
            },
            error: function (error) {
                console.error("Error al cargar categorias:", error);
            }
        });
    }
    listaUnidadesMedidas();

    /* =========================================
    VISTA PREVIA DE LA IMAGEN
    ========================================= */
    $('#imagen').on('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                $('#vista_previa_imagen').attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            $('#vista_previa_imagen').attr('src', '');
        }
    });

    /* =========================================
    CREAR MATERIAL O SERVICIO
    ========================================= */
    $("#btn_guardar_material_servicio").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let nombre = $("#nombre").val();
        let marca = $("#marca").val();
        let tipo = $("#tipo").val();
        let id_proveedor = $("#id_proveedor").val();
        let id_categoria = $("#id_categoria").val();
        let id_unidad_medida = $("#id_unidad_medida").val();
        let precio_compra = $("#precio_compra").val();
        let precio_venta = $("#precio_venta").val();
        let stock = $("#stock").val();
        let stock_minimo = $("#stock_minimo").val();
        let descripcion = $("#descripcion").val();
        let imagen = $("#imagen")[0].files[0];

        if (nombre == "" || nombre == null) {
            $("#error_nombre").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_nombre").html("");
        }

        if (tipo == "" || tipo == null) {
            $("#error_tipo").html("El tipo es obligatorio");
            isValid = false;
        } else {
            $("#error_tipo").html("");
        }

        if (id_proveedor == "" || id_proveedor == null) {
            $("#error_id_proveedor").html("El proveedor es obligatorio");
            isValid = false;
        } else {
            $("#error_id_proveedor").html("");
        }

        if (id_categoria == "" || id_categoria == null) {
            $("#error_id_categoria").html("La categoría es obligatoria");
            isValid = false;
        } else {
            $("#error_id_categoria").html("");
        }

        if (id_unidad_medida == "" || id_unidad_medida == null) {
            $("#error_id_unidad_medida").html("La unidad de medida es obligatoria");
            isValid = false;
        } else {
            $("#error_id_unidad_medida").html("");
        }

        if (precio_venta == "" || precio_venta == null) {
            $("#error_precio_venta").html("El precio de venta es obligatorio");
            isValid = false;
        } else {
            $("#error_precio_venta").html("");
        }

        if (stock == "" || stock == null) {
            $("#error_stock").html("El stock es obligatorio");
            isValid = false;
        } else {
            $("#error_stock").html("");
        }

        if (stock_minimo == "" || stock_minimo == null) {
            $("#error_stock_minimo").html("El stock mínimo es obligatorio");
            isValid = false;
        } else {
            $("#error_stock_minimo").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("nombre", nombre);
            datos.append("marca", marca);
            datos.append("tipo", tipo);
            datos.append("id_proveedor", id_proveedor);
            datos.append("id_categoria", id_categoria);
            datos.append("id_unidad_medida", id_unidad_medida);
            datos.append("precio_compra", precio_compra);
            datos.append("precio_venta", precio_venta);
            datos.append("stock", stock);
            datos.append("stock_minimo", stock_minimo);
            datos.append("descripcion", descripcion);
            if (imagen) {
                datos.append("imagen", imagen);
            }

            $.ajax({
                url: "crear-meterial-servicio/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarMaterialesServicios();
                        $("#modal_nuevo_material_servicio").modal("hide");
                        $("#form_crear_material_servicio")[0].reset();
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
                    console.error("Error al crear material o servicio:", error);
                }
            })
        }
    });

    /* =========================================
    EDITAR MATERIAL O SERVICIO
    ========================================= */
    $(".tabla_materiales_servicios").on("click", '.btnEditarMaterialServicio', function (e) {
        e.preventDefault();
        let material_servicio_id = $(this).attr("idMaterialServicio");
        const datos = new FormData();
        datos.append("material_servicio_id", material_servicio_id);
        $.ajax({
            url: "editar/",
            type: 'POST',
            data: datos,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.status) {
                    $("#material_servicio_id_edit").val(response.material_servicio.id);
                    $("#nombre_edit").val(response.material_servicio.nombre);
                    $("#tipo_edit").val(response.material_servicio.tipo);
                    $("#id_proveedor_edit").val(response.material_servicio.id_proveedor);
                    $("#id_categoria_edit").val(response.material_servicio.id_categoria);
                    $("#id_unidad_medida_edit").val(response.material_servicio.id_unidad_medida);
                    $("#precio_compra_edit").val(response.material_servicio.precio_compra);
                    $("#precio_venta_edit").val(response.material_servicio.precio_venta);
                    $("#stock_edit").val(response.material_servicio.stock);
                    $("#stock_minimo_edit").val(response.material_servicio.stock_minimo);
                    $("#descripcion_edit").val(response.material_servicio.descripcion);
                } else {
                    Swal.fire({
                        title: "¡Error!",
                        text: response.message,
                        icon: "error",
                    });
                }
            },
            error: function (error) {
                console.error("Error al editar material o servicio:", error);
            }
        })
    });

    /* =========================================
    ACTUALIZAR MATERIAL O SERVICIO
    ========================================= */
    $("#btn_editar_material_servicio").click(function (e) {
        e.preventDefault();
        let isValid = true;

        let material_servicio_id = $("#material_servicio_id_edit").val();
        let nombre = $("#nombre_edit").val();
        let tipo = $("#tipo_edit").val();
        let id_proveedor = $("#id_proveedor_edit").val();
        let id_categoria = $("#id_categoria_edit").val();
        let id_unidad_medida = $("#id_unidad_medida_edit").val();
        let precio_compra = $("#precio_compra_edit").val();
        let precio_venta = $("#precio_venta_edit").val();
        let stock = $("#stock_edit").val();
        let stock_minimo = $("#stock_minimo_edit").val();
        let descripcion = $("#descripcion_edit").val();
        let imagen = $("#imagen_edit")[0].files[0];

        if (nombre == "" || nombre == null) {
            $("#error_nombre_edit").html("El nombre es obligatorio");
            isValid = false;
        } else {
            $("#error_nombre_edit").html("");
        }

        if (tipo == "" || tipo == null) {
            $("#error_tipo_edit").html("El tipo es obligatorio");
            isValid = false;
        } else {
            $("#error_tipo_edit").html("");
        }

        if (id_proveedor == "" || id_proveedor == null) {
            $("#error_id_proveedor_edit").html("El proveedor es obligatorio");
            isValid = false;
        } else {
            $("#error_id_proveedor_edit").html("");
        }

        if (id_categoria == "" || id_categoria == null) {
            $("#error_id_categoria_edit").html("La categoría es obligatoria");
            isValid = false;
        } else {
            $("#error_id_categoria_edit").html("");
        }

        if (id_unidad_medida == "" || id_unidad_medida == null) {
            $("#error_id_unidad_medida_edit").html("La unidad de medida es obligatoria");
            isValid = false;
        } else {
            $("#error_id_unidad_medida_edit").html("");
        }

        if (precio_venta == "" || precio_venta == null) {
            $("#error_precio_venta_edit").html("El precio de venta es obligatorio");
            isValid = false;
        } else {
            $("#error_precio_venta_edit").html("");
        }

        if (stock == "" || stock == null) {
            $("#error_stock_edit").html("El stock es obligatorio");
            isValid = false;
        } else {
            $("#error_stock_edit").html("");
        }

        if (stock_minimo == "" || stock_minimo == null) {
            $("#error_stock_minimo_edit").html("El stock mínimo es obligatorio");
            isValid = false;
        } else {
            $("#error_stock_minimo_edit").html("");
        }

        if (isValid) {
            const datos = new FormData();
            datos.append("material_servicio_id", material_servicio_id);
            datos.append("nombre", nombre);
            datos.append("tipo", tipo);
            datos.append("id_proveedor", id_proveedor);
            datos.append("id_categoria", id_categoria);
            datos.append("id_unidad_medida", id_unidad_medida);
            datos.append("precio_compra", precio_compra);
            datos.append("precio_venta", precio_venta);
            datos.append("stock", stock);
            datos.append("stock_minimo", stock_minimo);
            datos.append("descripcion", descripcion);
            if (imagen) {
                datos.append("imagen", imagen);
            }

            $.ajax({
                url: "actualizar/",
                type: 'POST',
                data: datos,
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.status) {
                        cargarMaterialesServicios();
                        $("#modal_editar_material_servicio").modal("hide");
                        $("#form_editar_material_servicio")[0].reset();
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
                    console.error("Error al actualizar material o servicio:", error);
                }
            })
        }
    });

    /* =========================================
    ELIMINAR MATERIAL O SERVICIO
    ========================================= */
    $(".tabla_materiales_servicios").on("click", '.btnEliminarMaterialServicio', function (e) {
        e.preventDefault();
        let material_servicio_id = $(this).attr("idMaterialServicio");
        const datos = new FormData();
        datos.append("material_servicio_id", material_servicio_id);

        Swal.fire({
            title: "¿Está seguro de borrar el material o servicio?",
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
                            cargarMaterialesServicios();
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

});
