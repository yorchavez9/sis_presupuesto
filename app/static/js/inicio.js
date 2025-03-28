$(document).ready(function () {

        const metas = {
            clientes: 100,
            materiales_servicios: 100,
            presupuestos: 100,
            trabajadores: 100
        };

        const valoresActuales = {
            clientes: 0,
            materiales_servicios: 0,
            presupuestos: 0,
            trabajadores: 0
        };

        const selectores = {
            'total_clientes': 'clientes',
            'total_materiales_servicios': 'materiales_servicios',
            'total_presupuestos': 'presupuestos',
            'total_trabajadores': 'trabajadores'
        };

        async function cargarDatos(url, selectorId) {
            try {
            const response = await $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json'
            });
            const cantidad = response.length || 0;
            $(`#${selectorId}`).text(cantidad);
            const key = selectores[selectorId];
            valoresActuales[key] = cantidad;
            actualizarPorcentaje(selectorId, key);
            } catch (error) {
            console.error(`Error al cargar los datos desde ${url}:`, error);
            }
        }

        function actualizarPorcentaje(selectorId, key) {
            const actual = valoresActuales[key];
            const meta = metas[key];
            const porcentaje = (actual / meta) * 100;
            const porcentajeMostrar = Math.min(porcentaje, 100);
            const cardBody = $(`#${selectorId}`).closest('.card-body');
            const porcentajeElement = cardBody.find('.mb-0.text-muted span:first');
            const esAumento = porcentaje >= 100;
            porcentajeElement.html(`<i class="mdi mdi-arrow-${esAumento ? 'up' : 'down'}-bold"></i> ${porcentajeMostrar.toFixed(2)}%`);
            if (porcentaje >= 100) {
            porcentajeElement.removeClass('text-danger text-warning').addClass('text-success');
            } else if (porcentaje >= 50) {
            porcentajeElement.removeClass('text-danger text-success').addClass('text-warning');
            } else {
            porcentajeElement.removeClass('text-success text-warning').addClass('text-danger');
            }
        }

        async function cargarTodo() {
            await Promise.all([
            cargarDatos("lista-clientes/", "total_clientes"),
            cargarDatos("lista-material-servicio/", "total_materiales_servicios"),
            cargarDatos("lista-presupuestos/", "total_presupuestos"),
            cargarDatos("lista-trabajadores/", "total_trabajadores")
            ]);
        }

        cargarTodo();


    function cargarProyectosDashboard() {
        $.ajax({
            url: "lista-presupuestos/",
            type: 'GET',
            dataType: 'json',
            success: response => {
                const presupuestos = response.presupuestos;
                const tabla = $("#tabla_presupuesto_dashboard");
                const tbody = tabla.find("tbody");
                tbody.empty();

                presupuestos.forEach((dato, index) => {
                    let estadoBtn;
                    switch (dato.estado) {
                        case '1': // Completado
                            estadoBtn = `<button class="btn bg-success text-white badges btn-sm rounded btnActivar" 
                                         idPresupuesto="${dato.id}" estadoPresupuesto="0">Completado</button>`;
                            break;
                        case '2': // En progreso
                            estadoBtn = `<button class="btn bg-warning text-white badges btn-sm rounded btnActivar" 
                                         idPresupuesto="${dato.id}" estadoPresupuesto="1">En Progreso</button>`;
                            break;
                        case '3': // Pendiente
                        default:
                            estadoBtn = `<button class="btn bg-primary text-white badges btn-sm rounded btnActivar" 
                                         idPresupuesto="${dato.id}" estadoPresupuesto="2">Pendiente</button>`;
                            break;
                    }

                    const fila = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${dato.nombre_cliente || "Sin cliente"}</td>
                            <td>${dato.descripcion || "Sin descripción"}</td>
                            <td>${estadoBtn}</td>
                        </tr>
                    `;
                    tbody.append(fila);
                });

                if ($.fn.DataTable.isDataTable(tabla)) {
                    tabla.DataTable().destroy();
                }

                tabla.DataTable({
                    responsive: true,
                    autoWidth: false,
                    searching: false, // Ocultar el buscador
                    paging: false,    // Ocultar la paginación
                    info: false       // Ocultar la información de cantidad de datos
                });
            },
            error: error => {
                console.error("Error al cargar los presupuestos:", error);
            }
        });
    }

    cargarProyectosDashboard();

});
