$(document).ready(function () {


/* ============================================================ DATOS PRINCIPALES ============================================================================= */

    /* =========================================
    FORMATEO DE PRECIO O DINERO
    ========================================= */
    function formatCurrency(value) {
        if (!value) return "Sin sueldo";
        return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
    }

    /* =========================================
    MOSTRAR FECHA AUTOMATICO
    ========================================= */
    function cargarFecha() {
        let ahora = new Date();
        let fechaFormateada = ahora.toISOString().split("T")[0];
        $("#fecha").val(fechaFormateada);
    }

    /* =========================================
    MOSTRAR HORA AUTOMATICO
    ========================================= */
    function actualizarHora() {
        let ahora = new Date();
        let horas = ahora.getHours();
        let minutos = ahora.getMinutes();
        let segundos = ahora.getSeconds();
        let ampm = horas >= 12 ? "PM" : "AM";
        horas = horas % 12 || 12;

        let horaFormateada = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')} ${ampm}`;
        $("#hora").val(horaFormateada);
    }

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
                        $("#id_cliente_presupuesto").empty();
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
                    console.error("Error al crear usuario:", error);

                    // Verificar si la respuesta contiene un mensaje en JSON
                    let mensaje = "Ocurrió un error inesperado.";
                    if (error.responseJSON && error.responseJSON.message) {
                        mensaje = error.responseJSON.message;
                    }

                    Swal.fire({
                        title: "¡Error!",
                        text: mensaje,
                        icon: "error",
                    });
                }
            });

        }
    });

    /* =========================================
    LISTA DE CLIENTES
    ========================================= */
    function cargarClientes() {
        $.ajax({
            url: "lista-clientes/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                $("#id_cliente_presupuesto").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_cliente_presupuesto").append(`<option value="${data.id}">${data.nombre}</option>`);
                });
                $("#id_cliente_presupuesto_edit").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_cliente_presupuesto_edit").append(`<option value="${data.id}">${data.nombre}</option>`);
                });
            },
            error: function (error) {
                console.error("Error al cargar proveedores:", error);
            }
        });
    }
    
    /* =========================================
    LISTA DE COMPROBANTES
    ========================================= */
    function cargarComprobantes() {
        $.ajax({
            url: "lista-comprobantes/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                $("#id_comprobante").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_comprobante").append(`<option value="${data.id}">${data.comprobante}</option>`);
                });
                $("#id_comprobante_edit").append('<option value="" disabled selected>Seleccionar</option>');
                response.forEach(function (data) {
                    $("#id_comprobante_edit").append(`<option value="${data.id}">${data.comprobante}</option>`);
                });
            },
            error: function (error) {
                console.error("Error al cargar proveedores:", error);
            }
        });
    }
    
    /* =========================================
    LISTA DE SERIE Y NUMERO
    ========================================= */
    function mostrarSerieNumero() {
        $.ajax({
            url: "lista-presupuestos/",
            type: "GET",
            dataType: 'json',
            success: function (response) {
                console.log(response);
                if (response.length == 0 || response.length == null) {

                    // al selecione el select #id_comprobante obtener el valo rpara luego enviar 

                    $.ajax({
                        url: "mostrar-serie-numero-comprobante/",
                        type: "POST",
                        dataType: 'json',
                        success: function (response) {
                            console.log(response);

                        }
                    })
                }
            }
        })
    }

    /* =========================================
    MOSTRANDO EL SERIE Y EL NUMERO
    ========================================= */
    $("#id_comprobante").change(function (e) {
        e.preventDefault()
        let id_comprobante = $(this).val();
        $.ajax({
            url: "lista-presupuestos/",
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response.length == 0 || response.length == null) {
                    $.ajax({
                        url: "mostrar-serie-numero-comprobante/",
                        type: "POST",
                        dataType: 'json',
                        data: {
                            id_comprobante: id_comprobante
                        },
                        success: function (response) {
                            if (response.comprobante.serie && response.comprobante.folio_inicial) {
                                $("#serie").val(response.comprobante.serie);
                                $("#numero").val(response.comprobante.folio_inicial);
                            } else {
                                console.error("No se recibieron datos válidos.");
                            }
                        },
                        error: function (xhr, status, error) {
                            console.error("Error en la solicitud AJAX:", error);
                        }
                    });
                } else {

                }
            }
        })

    });

    cargarClientes();
    cargarFecha();
    actualizarHora();
    setInterval(actualizarHora, 1000);
    cargarComprobantes();
    mostrarSerieNumero()

/* ============================================================ END ================================================================================================ */

/* ============================================================ INICIO DE SECCION DE MATERIALES Y SERVICIOS ============================================================================= */

    $('.tabla_materiales_seleccionado_presupuesto').DataTable({
        "destroy": true,
        "responsive": true, // Habilita el modo responsive
        "scrollX": true, // Permite el desplazamiento horizontal
        "pageLength": 10,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
        }
    });


    /* =========================================
    INICIALIZAR TABLA DE LISTA MATERIALES
    ========================================= */
    function inicializarTablaMateriales() {
        return $('.tabla_materiales_seleccionado_presupuesto').DataTable({
            "destroy": true,
            "responsive": true, // Habilita el modo responsive
            "scrollX": true, // Permite el desplazamiento horizontal
            "pageLength": 10,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }
        });
    }

    /* =========================================
    INICIALIZAR TABLA DE LISTA MATERIALES
    ========================================= */
    function inicializarTablaMateriales() {
        return $('.tabla_materiales_servicios_presupuesto').DataTable({
            "destroy": true,
            "responsive": true, // Habilita el modo responsive
            "scrollX": true, // Permite el desplazamiento horizontal
            "pageLength": 10,
            "language": {
                "url": "//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json"
            }
        });
    }

    let tabla_materiales = inicializarTablaMateriales();
    let lista_materiales_seleccionados = [];

    /* =========================================
    MOSTRANDO MATERIALES EN LA TABLA
    ========================================= */
    function mostrarMateriales() {
        $.ajax({
            url: "lista-materiales-servicios/",
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                tabla_materiales.clear();
                response.forEach(function (dato, index) {
                    let stockClass = '';
                    if (dato.stock <= dato.stock_minimo) {
                        stockClass = 'bg-danger text-white';
                    } else if (dato.stock <= dato.stock_minimo * 2) {
                        stockClass = 'bg-warning text-dark';
                    } else {
                        stockClass = 'bg-success text-white';
                    }

                    tabla_materiales.row.add([
                        index + 1,
                        dato.id_categoria.nombre,
                        dato.nombre,
                        formatCurrency(dato.precio_venta),
                        `<div class="${stockClass} text-center" style="border-radius: 5px;">${dato.stock}</div>`,
                        dato.estado ?
                            `<button class="btn bg-success text-white badges btn-sm rounded btnActivar" idMaterial="${dato.id}" estadoMaterial="0">Activado</button>` :
                            `<button class="btn bg-danger text-white badges btn-sm rounded btnActivar" idMaterial="${dato.id}" estadoMaterial="1">Desactivado</button>`
                    ]);
                });
                tabla_materiales.draw();

                $('.tabla_materiales_servicios_presupuesto tbody').on('click', 'tr', function () {
                    $('.tabla_materiales_servicios_presupuesto tr').removeClass('selected');
                    $(this).addClass('selected');

                    const data = tabla_materiales.row(this).data();
                    console.log("Fila seleccionada:", data);
                });
            },
            error: function (error) {
                console.error("Error al cargar materiales:", error);
            }
        });
    }
    
    /* =========================================
    AGREGAR MATERIAL SELECIONADO
    ========================================= */
    function agregarMaterialSeleccionado(material) {
        // Verificar si el material ya está en la lista
        const materialExistente = lista_materiales_seleccionados.find(item => item.id === material.id);

        if (materialExistente) {
            // Si ya existe, incrementar la cantidad
            materialExistente.cantidad += 1;
        } else {
            // Si no existe, agregarlo a la lista
            lista_materiales_seleccionados.push({
                id: material.id,
                nombre: material.nombre,
                precio: material.precio,
                cantidad: 1
            });
        }

        // Actualizar la tabla y el subtotal
        actualizarTablaMaterialesSeleccionados();
        actualizarSubtotal();
    }

    /* =========================================
    ACTUALIZAR TABLA DE MATERIAL SELECCIONADO
    ========================================= */
    function actualizarTablaMaterialesSeleccionados() {
        const tbody = $(".tabla_materiales_seleccionado_presupuesto tbody");
        tbody.empty(); // Limpiar la tabla antes de agregar los nuevos datos
    
        lista_materiales_seleccionados.forEach((material, index) => {
            const subtotal = material.precio * material.cantidad;
            tbody.append(`
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <button class="btn btn-danger btn-sm btnEliminarMaterial" data-id="${material.id}">
                            <i class="uil-trash"></i>
                        </button>
                    </td>
                    <td>${material.nombre}</td>
                    <td>
                        <input type="number" class="form-control input-cantidad" data-id="${material.id}" value="${material.cantidad}" min="1">
                    </td>
                    <td>
                        <input type="number" class="form-control input-precio" data-id="${material.id}" value="${material.precio}" min="0.01" step="0.01">
                    </td>
                    <td class="subtotal-material">${formatCurrency(subtotal)}</td>
                </tr>
            `);
        });
    
        // Evento para actualizar la cantidad en tiempo real
        $(".input-cantidad").on("input", function () {
            const idMaterial = $(this).data("id");
            const nuevaCantidad = parseFloat($(this).val());
    
            const material = lista_materiales_seleccionados.find(item => item.id === idMaterial);
            if (material && nuevaCantidad > 0) {
                material.cantidad = nuevaCantidad;
                actualizarSubtotalMaterial(idMaterial); // Actualizar subtotal del material
                actualizarSubtotal(); // Recalcular el subtotal general
            }
        });
    
        // Evento para actualizar el precio en tiempo real
        $(".input-precio").on("input", function () {
            const idMaterial = $(this).data("id");
            const nuevoPrecio = parseFloat($(this).val());
    
            const material = lista_materiales_seleccionados.find(item => item.id === idMaterial);
            if (material && nuevoPrecio > 0) {
                material.precio = nuevoPrecio;
                actualizarSubtotalMaterial(idMaterial); // Actualizar subtotal del material
                actualizarSubtotal(); // Recalcular el subtotal general
            }
        });
    
        // Evento para eliminar materiales
        $(".btnEliminarMaterial").click(function () {
            const idMaterial = $(this).data("id");
            lista_materiales_seleccionados = lista_materiales_seleccionados.filter(item => item.id !== idMaterial);
            actualizarTablaMaterialesSeleccionados(); // Redibujar la tabla
            actualizarSubtotal(); // Recalcular el subtotal
        });
    }
    
    /* =========================================
    ACTUALIZAR SUB TOTAL MATERIAL
    ========================================= */
    function actualizarSubtotalMaterial(idMaterial) {
        const material = lista_materiales_seleccionados.find(item => item.id === idMaterial);
        if (material) {
            const subtotal = material.cantidad * material.precio;
            $(`input[data-id="${idMaterial}"]`).closest("tr").find(".subtotal-material").text(formatCurrency(subtotal));
        }
    }
    
    /* =========================================
    ACTUALIZAR SUB TOTAL GENERAL
    ========================================= */
    function actualizarSubtotal() {
        const subtotal = lista_materiales_seleccionados.reduce((total, material) => {
            return total + (material.precio * material.cantidad);
        }, 0);
    
        $("#sub_total_meteriales").text(formatCurrency(subtotal));
    }

    /* =========================================
    SELECION DEL MATERIAL
    ========================================= */
    $(".tabla_materiales_servicios_presupuesto tbody").on("click", "tr", function () {
        const data = tabla_materiales.row(this).data();
        if (!data) return;

        const material = {
            id: data[0], // ID del material
            nombre: data[2], // Nombre del material
            precio: parseFloat(data[3].replace(/[^\d.]/g, '')) // Precio del material
        };

        agregarMaterialSeleccionado(material);
    });

    mostrarMateriales();

/* ============================================================ END ============================================================================= */

})