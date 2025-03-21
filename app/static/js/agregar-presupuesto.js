
$(document).ready(function () {


    /* ============================================================ DATOS PRINCIPALES ============================================================================= */

    /* =========================================
    FORMATEO DE PRECIO O DINERO
    ========================================= */
    function formatCurrency(value) {
        if (!value) return "S/ 0.00";
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
            url: "obtener-ultimo-comprobante/",
            type: "POST",
            dataType: 'json',
            data: {
                id_comprobante: id_comprobante
            },
            success: function (response) {
                console.log(response);
                if (response.status == "not_found") {
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
                    if (response.ultimo_comprobante.id_comprobante == id_comprobante) {
                        let increment_numero = response.ultimo_comprobante.numero + 1;
                        $("#serie").val(response.ultimo_comprobante.serie);
                        $("#numero").val(increment_numero);
                    }
                }
            }
        })

    });

    // Asignar el evento input al campo #impuesto
    $("#impuesto").on("input", function() {
        sub_total_general_presupuesto();
    });


    cargarClientes();
    cargarFecha();
    actualizarHora();
    setInterval(actualizarHora, 1000);
    cargarComprobantes();
    mostrarSerieNumero()

    /* ============================================================ END ================================================================================================ */

























    /* ============================================================ INICIO DE SECCION DE METROS DE TERREONO============================================================================= */

    function calcularSubtotal() {
        let medidaTerreno = parseFloat($('#medida_terreno').val()) || 0;
        let precioTerreno = parseFloat($('#precio_terreno').val()) || 0;
        let subtotal = medidaTerreno * precioTerreno;

        $('#sub_total_terreno').val(subtotal.toFixed(2));
        $('#sub_total_metros_terreno').text('S/ ' + subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2 }));
    }

    $('#medida_terreno, #precio_terreno').on('input', function () {
        calcularSubtotal();
        sub_total_general_presupuesto();
    });

    /* ============================================================ END ================================================================================================ */
























    /* ============================================================ INICIO DE SECCION DE MATERIALES Y SERVICIOS ============================================================================= */

    let lista_materiales_seleccionados = [];

    /* =========================================
    FUNCIÓN PARA MOSTRAR MATERIALES EN LA TABLA
    ========================================= */
    async function mostrarMateriales() {
        try {
            const response = await $.ajax({
                url: "lista-materiales-servicios/", // Asegúrate de que la URL sea correcta
                type: 'GET',
                dataType: 'json',
            });

            const tabla = $("#tabla_materiales_servicios_presupuesto");
            const tbody = tabla.find("tbody");
            tbody.empty(); // Limpiar el contenido actual de la tabla

            // Llenar la tabla con los datos recibidos
            response.forEach((dato, index) => {
                const ruta_imagen = RUTA_BASE_IMAGENES + dato.imagen;
                const stockClass = dato.stock <= dato.stock_minimo
                    ? 'bg-danger text-white'
                    : dato.stock <= dato.stock_minimo * 2
                        ? 'bg-warning text-dark'
                        : 'bg-success text-white';

                const fila = `
                        <tr>
                            <td>${index + 1}</td>
                            <td hidden>${dato.id}</td>
                            <td>${dato.id_categoria.nombre}</td>
                            <td><img src="${ruta_imagen}" alt="" width="30%" class="img-fluid imagen_vista_material"></td>
                            <td>${dato.nombre}</td>
                            <td>${formatCurrency(dato.precio_venta)}</td>
                            <td><button type="button" class="btn btn-sm ${stockClass}">${dato.stock}</button></td>
                        </tr>
                    `;
                tbody.append(fila);
            });

            // Destruir DataTable si ya está inicializado
            if ($.fn.DataTable.isDataTable("#tabla_materiales_servicios_presupuesto")) {
                tabla.DataTable().destroy();
            }

            // Re-inicializar DataTables
            const dataTable = tabla.DataTable({
                autoWidth: true,
                responsive: true,
                destroy: true, // Asegura que se pueda reinicializar
                retrieve: true, // Mantiene la instancia si ya existe
            });

            // Selección de filas con DataTables
            tabla.on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    dataTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        } catch (error) {
            console.error("Error al cargar materiales:", error);
        }
    }


    /* =========================================
    FUNCIÓN PARA AGREGAR MATERIAL SELECCIONADO
    ========================================= */
    function agregarMaterialSeleccionado(material) {
        const materialExistente = lista_materiales_seleccionados.find(item => item.id === material.id);

        if (materialExistente) {
            materialExistente.cantidad += 1;
        } else {
            lista_materiales_seleccionados.push({
                id: material.id,
                nombre: material.nombre,
                precio: material.precio,
                cantidad: 1
            });
        }

        actualizarTablaMaterialesSeleccionados();
        actualizarSubtotal();
    }


    /* =========================================
    FUNCIÓN PARA ACTUALIZAR LA TABLA DE MATERIALES SELECCIONADOS
    ========================================= */
    function actualizarTablaMaterialesSeleccionados() {
        const tabla = $("#tabla_materiales_seleccionado_presupuesto");
        const tbody = tabla.find("tbody");
        const dataTable = tabla.DataTable();

        // Limpiar la tabla
        dataTable.clear().draw();

        // Agregar los nuevos datos
        lista_materiales_seleccionados.forEach((material, index) => {
            const subtotal = material.precio * material.cantidad;
            dataTable.row.add([
                index + 1,
                `<button class="btn btn-danger btn-sm btnEliminarMaterial" data-id="${material.id}">
                        <i class="uil-trash"></i>
                    </button>`,
                material.nombre,
                `<input type="number" class="form-control input-cantidad" data-id="${material.id}" value="${material.cantidad}" min="1">`,
                `<input type="number" class="form-control input-precio" data-id="${material.id}" value="${material.precio}" min="0.01" step="0.01">`,
                `<p class="subtotal-material">${formatCurrency(subtotal)}<p>`
            ]).draw(false); // Agregar la fila sin redibujar la tabla
        });

        // Eventos para actualizar cantidad y precio en tiempo real
        tbody.on("input", ".input-cantidad", function () {
            const idMaterial = $(this).data("id").toString();
            const nuevaCantidad = parseFloat($(this).val());

            const material = lista_materiales_seleccionados.find(item => item.id.toString() == idMaterial);
            if (material && nuevaCantidad > 0) {
                material.cantidad = nuevaCantidad;
                actualizarSubtotalMaterial(idMaterial);
                actualizarSubtotal();
                sub_total_general_presupuesto();
            }
        });

        tbody.on("input", ".input-precio", function () {
            const idMaterial = $(this).data("id").toString();
            const nuevoPrecio = parseFloat($(this).val());

            const material = lista_materiales_seleccionados.find(item => item.id.toString() == idMaterial);
            if (material && nuevoPrecio > 0) {
                material.precio = nuevoPrecio;
                actualizarSubtotalMaterial(idMaterial);
                actualizarSubtotal();
                sub_total_general_presupuesto();
            }
        });

        tbody.on("click", ".btnEliminarMaterial", function () {
            const idMaterial = $(this).data("id").toString();

            // Filtrar los materiales eliminando el seleccionado
            lista_materiales_seleccionados = lista_materiales_seleccionados.filter(item => item.id.toString() != idMaterial);

            // Actualizar la tabla y los subtotales después de eliminar
            actualizarTablaMaterialesSeleccionados();
            actualizarSubtotal();
            sub_total_general_presupuesto();
        });
    }

    /* =========================================
    FUNCIÓN PARA ACTUALIZAR EL SUBTOTAL DE UN MATERIAL
    ========================================= */
    function actualizarSubtotalMaterial(idMaterial) {
        const material = lista_materiales_seleccionados.find(item => item.id.toString() == idMaterial);
        if (material) {
            const subtotal = material.cantidad * material.precio;
            console.log(subtotal);
            $(`.input-cantidad[data-id="${idMaterial}"]`)
                .closest("tr")
                .find(".subtotal-material")
                .text(formatCurrency(subtotal));
        }
    }


    /* =========================================
    FUNCIÓN PARA ACTUALIZAR EL SUBTOTAL GENERAL
    ========================================= */
    function actualizarSubtotal() {
        const subtotal = lista_materiales_seleccionados.reduce((total, material) => {
            const precio = parseFloat(material.precio) || 0;
            const cantidad = parseFloat(material.cantidad) || 0;
            return total + (precio * cantidad);
        }, 0);

        $("#sub_total_meteriales").text(formatCurrency(subtotal));
    }

    /* =========================================
    EVENTO PARA SELECCIONAR MATERIAL
    ========================================= */
    $("#tabla_materiales_servicios_presupuesto tbody").on("click", "tr", function () {
        const fila = $(this); // Obtener la fila seleccionada
        const id = fila.find("td:eq(1)").text().trim(); // Obtener el ID de la segunda columna
        const nombre = fila.find("td:eq(4)").text().trim(); // Obtener el nombre de la tercera columna
        const precio = parseFloat(fila.find("td:eq(5)").text().replace(/[^\d.]/g, '')); // Obtener el precio de la quinta columna

        const material = {
            id: id,
            nombre: nombre,
            precio: precio
        };
        console.log(material);

        agregarMaterialSeleccionado(material);
    });

    // Mostrar materiales al cargar la página
    mostrarMateriales();


    /* ============================================================ END ============================================================================= */


































    /* ============================================================ INICIO DE SECCION DE TRABAJADORES ============================================================================= */
    let lista_trabajadores_seleccionados = [];

    /* =========================================
    FUNCIÓN PARA MOSTRAR TRABAJADORES EN LA TABLA
    ========================================= */
    async function mostrarTrabajadores() {
        try {
            const response = await $.ajax({
                url: "lista-trabajadores/",
                type: 'GET',
                dataType: 'json',
            });

            const tabla = $("#tabla_lista_trabajadores");
            const tbody = tabla.find("tbody");
            tbody.empty(); // Limpiar el contenido actual de la tabla

            // Llenar la tabla con los datos recibidos
            response.forEach((dato, index) => {
                const fila = `
                    <tr>
                        <td>${index + 1}</td>
                        <td hidden>${dato.id}</td>
                        <td>${dato.especialidad.especialidad}</td>
                        <td>${dato.nombre}</td>
                    </tr>
                `;
                tbody.append(fila);
            });

            // Destruir DataTable si ya está inicializado
            if ($.fn.DataTable.isDataTable("#tabla_lista_trabajadores")) {
                tabla.DataTable().destroy();
            }

            // Re-inicializar DataTables
            const dataTable = tabla.DataTable({
                autoWidth: true,
                responsive: true,
                destroy: true, // Asegura que se pueda reinicializar
                retrieve: true, // Mantiene la instancia si ya existe
            });

            // Selección de filas con DataTables
            tabla.on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    dataTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        } catch (error) {
            console.error("Error al cargar trabajadores:", error);
        }
    }

    /* =========================================
    FUNCIÓN PARA AGREGAR TRABAJADOR SELECCIONADO
    ========================================= */
    function agregarTrabajadorSeleccionado(trabajador) {
        const trabajadorExistente = lista_trabajadores_seleccionados.find(item => item.id === trabajador.id);

        if (trabajadorExistente) {
            trabajadorExistente.cantidad += 1;
        } else {
            lista_trabajadores_seleccionados.push({
                id: trabajador.id,
                nombre: trabajador.nombre,
                especialidad: trabajador.especialidad,
                cantidad: 1,
                precio: 0.00
            });
        }

        actualizarTablaTrabajadoresSeleccionados();
        actualizarSubtotalTrabajadores();
    }

    /* =========================================
    FUNCIÓN PARA ACTUALIZAR LA TABLA DE TRABAJADORES SELECCIONADOS
    ========================================= */
    function actualizarTablaTrabajadoresSeleccionados() {
        const tabla = $("#tabla_detalle_trabajadores");
        const tbody = tabla.find("tbody");
        const dataTable = tabla.DataTable();

        // Limpiar la tabla
        dataTable.clear().draw();

        // Agregar los nuevos datos
        lista_trabajadores_seleccionados.forEach((trabajador, index) => {
            const subtotal = trabajador.precio * trabajador.cantidad;
            dataTable.row.add([
                index + 1,
                `<button class="btn btn-danger btn-sm btnEliminarTrabajador" data-id="${trabajador.id}">
                    <i class="uil-trash"></i>
                </button>`,
                trabajador.nombre,
                trabajador.especialidad,
                `<select name="tipo_sueldo_trabajador" class="form-select tipo_sueldo_trabajador" id_trabajador="${trabajador.id}">
                    <option value="" selected disabled>Seleccione</option>
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="quincenal">Quincenal</option>
                    <option value="mensual">Mensual</option>
                    <option value="proyecto">Proyecto</option>
                </select>`,
                `<input type="number" class="form-control input-precio-trabajador" data-id="${trabajador.id}" value="${trabajador.precio}" min="0.01" step="0.01">`,
                `<input type="number" class="form-control input-cantidad-tiempo-trabajador" data-id="${trabajador.id}" value="${trabajador.cantidad}" min="1">`,
                `<p class="sub_total_trabajador">${formatCurrency(subtotal)}</p>`
            ]).draw(false); // Agregar la fila sin redibujar la tabla
        });

        // Eventos para actualizar cantidad y precio en tiempo real
        tbody.on("input", ".input-cantidad-tiempo-trabajador", function () {
            const idTrabajador = $(this).data("id").toString();
            const nuevaCantidad = parseFloat($(this).val());

            const trabajador = lista_trabajadores_seleccionados.find(item => item.id.toString() === idTrabajador);
            if (trabajador && nuevaCantidad > 0) {
                trabajador.cantidad = nuevaCantidad;
                actualizarSubtotalTrabajadoresId(idTrabajador);
                actualizarSubtotalTrabajadores();
                sub_total_general_presupuesto();
            }
        });

        tbody.on("input", ".input-precio-trabajador", function () {
            const idTrabajador = $(this).data("id").toString();
            const nuevoPrecio = parseFloat($(this).val());

            const trabajador = lista_trabajadores_seleccionados.find(item => item.id.toString() === idTrabajador);
            if (trabajador && nuevoPrecio > 0) {
                trabajador.precio = nuevoPrecio;
                actualizarSubtotalTrabajadoresId(idTrabajador);
                actualizarSubtotalTrabajadores();
                sub_total_general_presupuesto();
            }
        });

        tbody.on("click", ".btnEliminarTrabajador", function () {
            const idTrabajador = $(this).data("id").toString();

            // Filtrar los trabajadores eliminando el seleccionado
            lista_trabajadores_seleccionados = lista_trabajadores_seleccionados.filter(item => item.id !== idTrabajador);

            // Actualizar la tabla y los subtotales después de eliminar
            actualizarTablaTrabajadoresSeleccionados();
            actualizarSubtotalTrabajadores();
            sub_total_general_presupuesto();
        });
    }

    /* =========================================
    MOSTRAR SUELDO DEPENDIENDO TRABAJADOR
    ========================================= */
    $(document).on("change", ".tipo_sueldo_trabajador", function () {
        const idTrabajador = $(this).attr("id_trabajador");
        const tipoSueldo = $(this).val();

        const datos = {
            id_trabajador: idTrabajador,
            tipo_sueldo: tipoSueldo
        };

        $.ajax({
            url: "trabajador-sueldo/",
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(datos),
            success: function (response) {
                if (response.status) {
                    const trabajador = response.trabajador;

                    // Buscar el trabajador en la lista y actualizar su precio
                    const trabajadorSeleccionado = lista_trabajadores_seleccionados.find(item => item.id.toString() === trabajador.id.toString());
                    if (trabajadorSeleccionado) {
                        trabajadorSeleccionado.precio = trabajador.sueldo; // Actualizar el precio
                    }

                    // Actualizar el campo de precio en la tabla
                    $(`input[data-id="${trabajador.id}"].input-precio-trabajador`).val(trabajador.sueldo);

                    // Recalcular el subtotal del trabajador
                    actualizarSubtotalTrabajadoresId(trabajador.id);

                    // Recalcular el subtotal general
                    actualizarSubtotalTrabajadores();
                    sub_total_general_presupuesto();
                } else {
                    console.error("Error en la respuesta del servidor:", response.message);
                }
            },
            error: function (error) {
                console.error("Error al enviar datos:", error);
            }
        });
    });


    /* =========================================
    FUNCIÓN PARA ACTUALIZAR EL SUBTOTAL DE UN TRABAJADOR
    ========================================= */
    function actualizarSubtotalTrabajadoresId(idTrabajador) {
        const trabajador = lista_trabajadores_seleccionados.find(item => item.id.toString() === idTrabajador.toString());
        if (trabajador) {
            const subtotal = parseFloat(trabajador.cantidad) * parseFloat(trabajador.precio)
            $(`input[data-id="${idTrabajador}"]`).closest("tr").find(".sub_total_trabajador").text(formatCurrency(subtotal));
        }
    }

    /* =========================================
    FUNCIÓN PARA ACTUALIZAR EL SUBTOTAL GENERAL
    ========================================= */
    function actualizarSubtotalTrabajadores() {
        const subtotal = lista_trabajadores_seleccionados.reduce((total, trabajador) => {
            return total + (trabajador.precio * trabajador.cantidad);
        }, 0);

        $("#sub_total_trabajadores_presupuesto").text(formatCurrency(subtotal));
    }

    /* =========================================
    EVENTO PARA SELECCIONAR TRABAJADOR
    ========================================= */
    $("#tabla_lista_trabajadores tbody").on("click", "tr", function () {
        const fila = $(this); // Obtener la fila seleccionada
        const id = fila.find("td:eq(1)").text().trim(); // Obtener el ID de la segunda columna
        const nombre = fila.find("td:eq(3)").text().trim(); // Obtener el nombre de la cuarta columna
        const especialidad = fila.find("td:eq(2)").text().trim(); // Obtener la especialidad de la tercera columna

        const trabajador = {
            id: id,
            nombre: nombre,
            especialidad: especialidad,
            precio: 0 // Puedes ajustar el precio según sea necesario
        };

        agregarTrabajadorSeleccionado(trabajador);
    });

    // Mostrar trabajadores al cargar la página
    mostrarTrabajadores();
    /* ============================================================ END ============================================================================= */












































    /* ============================================================ SECCION DE EQUIPOS MAQUINARIAS ===================================================*/
    let lista_maquina_equipo_seleccionados = [];

    /* =========================================
    FUNCIÓN PARA MOSTRAR MÁQUINAS Y EQUIPOS EN LA TABLA
    ========================================= */
    async function mostrarEquiposMaquinas() {
        try {
            const response = await $.ajax({
                url: "lista-equipos-maquinas/",
                type: 'GET',
                dataType: 'json',
            });

            const tabla = $(".tabla_lista_equipos_maquinas");
            const tbody = tabla.find("tbody");
            tbody.empty(); // Limpiar el contenido actual de la tabla

            // Llenar la tabla con los datos recibidos
            response.forEach((dato, index) => {
                const fila = `
                <tr>
                    <td>${index + 1}</td>
                    <td hidden>${dato.id}</td>
                    <td>${dato.tipo}</td>
                    <td>${dato.nombre}</td>
                </tr>
            `;
                tbody.append(fila);
            });

            // Destruir DataTable si ya está inicializado
            if ($.fn.DataTable.isDataTable(".tabla_lista_equipos_maquinas")) {
                tabla.DataTable().destroy();
            }

            // Re-inicializar DataTables
            const dataTable = tabla.DataTable({
                autoWidth: true,
                responsive: true,
                destroy: true, // Asegura que se pueda reinicializar
                retrieve: true, // Mantiene la instancia si ya existe
            });

            // Selección de filas con DataTables
            tabla.on('click', 'tr', function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected');
                } else {
                    dataTable.$('tr.selected').removeClass('selected');
                    $(this).addClass('selected');
                }
            });
        } catch (error) {
            console.error("Error al cargar máquinas y equipos:", error);
        }
    }

    /* =========================================
    FUNCIÓN PARA AGREGAR MÁQUINA O EQUIPO SELECCIONADO
    ========================================= */
    function agregarMaquinaSeleccionado(maquina) {
        const maquinaExistente = lista_maquina_equipo_seleccionados.find(item => item.id === maquina.id);

        if (maquinaExistente) {
            maquinaExistente.cantidad += 1;
        } else {
            lista_maquina_equipo_seleccionados.push({
                id: maquina.id,
                tipo: maquina.tipo,
                nombre: maquina.nombre,
                cantidad: 1,
                costo: 0.00
            });
        }

        actualizarTablaMaquinasEquiposSeleccionados();
        actualizarSubtotalMaquinas();
    }

    /* =========================================
    FUNCIÓN PARA ACTUALIZAR LA TABLA DE MÁQUINAS Y EQUIPOS SELECCIONADOS
    ========================================= */
    function actualizarTablaMaquinasEquiposSeleccionados() {
        const tabla = $("#tabla_detalle_maquinas_equipos_presupuesto");
        const tbody = tabla.find("tbody");
        const dataTable = tabla.DataTable();

        // Limpiar la tabla
        dataTable.clear().draw();

        // Agregar los nuevos datos
        lista_maquina_equipo_seleccionados.forEach((maquina, index) => {
            const subtotal = maquina.costo * maquina.cantidad;
            dataTable.row.add([
                index + 1,
                `<button class="btn btn-danger btn-sm btnEliminarMaquina" data-id="${maquina.id}">
                <i class="uil-trash"></i>
            </button>`,
                maquina.tipo,
                maquina.nombre,
                `<select name="tipo_sueldo_maquina" class="form-select tipo_sueldo_maquina" id_maquina="${maquina.id}">
                <option selected disabled>Seleccione</option>
                <option value="hora">Hora</option>
                <option value="diario">Diario</option>
                <option value="semanal">Semanal</option>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
                <option value="proyecto">Proyecto</option>
            </select>`,
                `<input type="number" class="form-control input-precio-maquina" data-id="${maquina.id}" value="${maquina.costo}" min="0.01" step="0.01">`,
                `<input type="number" class="form-control input-cantidad-tiempo-maquina" data-id="${maquina.id}" value="${maquina.cantidad}" min="1">`,
                `<p class="sub_total_equipo_maquina">${formatCurrency(subtotal)}</p>`
            ]).draw(false); // Agregar la fila sin redibujar la tabla
        });

        // Eventos para actualizar cantidad y costo en tiempo real
        tbody.on("input", ".input-cantidad-tiempo-maquina", function () {
            const idMaquina = $(this).data("id").toString();
            const nuevaCantidad = parseFloat($(this).val());

            const maquina = lista_maquina_equipo_seleccionados.find(item => item.id === idMaquina);
            if (maquina && nuevaCantidad > 0) {
                maquina.cantidad = nuevaCantidad;
                actualizarSubtotalMaquinaId(idMaquina);
                actualizarSubtotalMaquinas();
                sub_total_general_presupuesto();
            }
        });

        tbody.on("input", ".input-precio-maquina", function () {
            const idMaquina = $(this).data("id").toString();
            const nuevoCosto = parseFloat($(this).val());

            const maquina = lista_maquina_equipo_seleccionados.find(item => item.id === idMaquina);
            if (maquina && nuevoCosto > 0) {
                maquina.costo = nuevoCosto;
                actualizarSubtotalMaquinaId(idMaquina);
                actualizarSubtotalMaquinas();
                sub_total_general_presupuesto();
            }
        });

        tbody.on("click", ".btnEliminarMaquina", function () {
            const idMaquina = $(this).data("id").toString();

            // Filtrar las máquinas eliminando la seleccionada
            lista_maquina_equipo_seleccionados = lista_maquina_equipo_seleccionados.filter(item => item.id !== idMaquina);

            // Actualizar la tabla y los subtotales después de eliminar
            actualizarTablaMaquinasEquiposSeleccionados();
            actualizarSubtotalMaquinas();
            sub_total_general_presupuesto();
        });
    }


    /* =========================================
            MOSTRAR SUELDO DEPENDIENDO MAQUINA O EQUIPO
            ========================================= */
    $(document).on("change", ".tipo_sueldo_maquina", function () {
        const id_maquina = $(this).attr("id_maquina");
        const tipo_sueldo = $(this).val();

        const datos = {
            id_maquina: id_maquina,
            tipo_sueldo: tipo_sueldo
        };

        $.ajax({
            url: "maquina-sueldo/",
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(datos),
            success: function (response) {
                if (response.status) {
                    const maquina = response.maquina;

                    // Buscar la máquina en la lista y actualizar su costo
                    const maquinaSeleccionado = lista_maquina_equipo_seleccionados.find(item => item.id.toString() === maquina.id.toString());
                    console.log(maquinaSeleccionado);
                    if (maquinaSeleccionado) {
                        maquinaSeleccionado.costo = maquina.costo;
                    }

                    // Actualizar el campo de costo en la tabla
                    $(`input[data-id="${maquina.id}"].input-precio-maquina`).val(maquina.costo);

                    // Recalcular el subtotal de la máquina
                    actualizarSubtotalMaquinaId(maquina.id.toString());

                    // Recalcular el subtotal general
                    actualizarSubtotalMaquinas();
                    sub_total_general_presupuesto();
                } else {
                    // Mostrar mensaje de error con SweetAlert
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || "Ocurrió un error inesperado.",
                    });
                }
            },
            error: function (error) {
                console.log(error);
                Swal.fire({
                    icon: 'warning',
                    title: '¡Aviso!',
                    text: error.responseJSON.message,
                });
            }
        });
    });


    /* =========================================
    FUNCIÓN PARA ACTUALIZAR EL SUBTOTAL DE UNA MÁQUINA
    ========================================= */
    function actualizarSubtotalMaquinaId(idMaquina) {
        const maquina = lista_maquina_equipo_seleccionados.find(item => item.id === idMaquina);
        if (maquina) {
            const subtotal = parseFloat(maquina.cantidad )* parseFloat(maquina.costo);
            $(`input[data-id="${idMaquina}"]`).closest("tr").find(".sub_total_equipo_maquina").text(formatCurrency(subtotal));
        }
    }

    /* =========================================
    FUNCIÓN PARA ACTUALIZAR EL SUBTOTAL GENERAL
    ========================================= */
    function actualizarSubtotalMaquinas() {
        const subtotal = lista_maquina_equipo_seleccionados.reduce((total, maquina) => {
            return total + (maquina.costo * maquina.cantidad);
        }, 0);

        $("#sub_total_maquinas_equipos").text(formatCurrency(subtotal));
    }

    /* =========================================
    EVENTO PARA SELECCIONAR MÁQUINA O EQUIPO
    ========================================= */
    $(".tabla_lista_equipos_maquinas tbody").on("click", "tr", function () {
        const fila = $(this); // Obtener la fila seleccionada
        const id = fila.find("td:eq(1)").text().trim(); // Obtener el ID de la segunda columna
        const tipo = fila.find("td:eq(2)").text().trim(); // Obtener el tipo de la tercera columna
        const nombre = fila.find("td:eq(3)").text().trim(); // Obtener el nombre de la cuarta columna

        const maquina = {
            id: id,
            tipo: tipo,
            nombre: nombre,
            costo: 0 // Costo inicial
        };

        agregarMaquinaSeleccionado(maquina);
    });

    // Mostrar máquinas y equipos al cargar la página
    mostrarEquiposMaquinas();

    /* ============================================================ END ============================================================================= */

























    function sub_total_general_presupuesto() {
        let suma_total = 0.00;
        let sub_total_metros_terreno = parseFloat($("#sub_total_metros_terreno").text().replace(/[S/,]/g, ""));
        let sub_total_meteriales = parseFloat($("#sub_total_meteriales").text().replace(/[S/,]/g, ""));
        let sub_total_trabajadores_presupuesto = parseFloat($("#sub_total_trabajadores_presupuesto").text().replace(/[S/,]/g, ""));
        let sub_total_maquinas_equipos = parseFloat($("#sub_total_maquinas_equipos").text().replace(/[S/,]/g, ""));
        let impuesto = parseFloat($("#impuesto").val());
        suma_total = (sub_total_metros_terreno + sub_total_meteriales + sub_total_trabajadores_presupuesto + sub_total_maquinas_equipos);

        // 1. Calcular el valor base (sin IGV)
        let base = suma_total / 1.18;

        // 2. Calcular el IGV (18% del valor base)
        let IGV = base * 0.18;

        // 3. Calcular el crédito fiscal (18% de las compras)
        let credito_fiscal = impuesto * 0.18;

        // 4. Calcular el IGV a pagar
        let igv_a_pagar = IGV - credito_fiscal;

        // 5. Calcular el total (suma_total ya incluye IGV, no es necesario sumarlo de nuevo)
        let total = suma_total;

        // Mostrar los resultados en el HTML
        $("#sub_total_presupuesto").text(formatCurrency(base)); // Sub Total (sin IGV)
        $("#sub_total_impuesto_presupuesto").text(formatCurrency(igv_a_pagar)); // Impuesto (IGV a pagar)
        $("#total_presupuesto").text(formatCurrency(total)); // Total (suma_total con IGV)
    }

})