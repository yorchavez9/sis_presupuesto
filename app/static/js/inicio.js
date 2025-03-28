$(document).ready(function () {
    async function cargarDatos(url, selector) {
        try {
            const response = await $.ajax({
                url: url,
                type: 'GET',
                dataType: 'json'
            });
            $(selector).text(response.length);
        } catch (error) {
            console.error(`Error al cargar los datos desde ${url}:`, error);
        }
    }

    async function cargarTodo() {
        await Promise.all([
            cargarDatos("lista-empleados/", "#total_empleados"),
            cargarDatos("lista-incidentes/", "#total_incidencias"),
            cargarDatos("lista-documentos/", "#total_documentos"),
            cargarDatos("lista-proyectos/", "#total_proyectos")
        ]);
    }

    cargarTodo();

    function cargarProyectosDashboard() {
        $.ajax({
            url: "lista-proyectos/",
            type: 'GET',
            dataType: 'json',
            success: proyectos => {
                const tabla = $("#tabla_dashboard_proyectos");
                const tbody = tabla.find("tbody");
                tbody.empty();
                
                proyectos.forEach((dato, index) => {
                    let estadoBtn;
                    switch (dato.estado) {
                        case 'completado':
                            estadoBtn = `<button class="btn bg-success text-white badges btn-sm rounded btnActivar" 
                                         idEmpleado="${dato.id}" estadoEmpleado="0">Completado</button>`;
                            break;
                        case 'en_progreso':
                            estadoBtn = `<button class="btn bg-warning text-white badges btn-sm rounded btnActivar" 
                                         idEmpleado="${dato.id}" estadoEmpleado="1">En Progreso</button>`;
                            break;
                        case 'pendiente':
                        default:
                            estadoBtn = `<button class="btn bg-primary text-white badges btn-sm rounded btnActivar" 
                                         idEmpleado="${dato.id}" estadoEmpleado="2">Pendiente</button>`;
                            break;
                    }
                    
                    const fila = `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${dato.nombre || "Sin nombre"}</td>
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
            }
        });
    }

    cargarProyectosDashboard();

});
