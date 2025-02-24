$(document).ready(function(){
    function cargarUsuarios(){
        $.ajax({
            url: "lista/",
            type: 'GET',
            dataType: 'json',
            success: function(usuarios){
                let tabla = $('#tabla_usuarios');
                let tbody = tabla.find('tbody');
                tbody.empty();
                
                usuarios.forEach((usuario, index) => {
                    tbody.append(`
                        <tr>
                            <td>
                            <div class="form-check style-check d-flex align-items-center">
                                <input class="form-check-input" type="checkbox">
                                <label class="form-check-label">
                                ${index + 1}
                                </label>
                            </div>
                            </td>
                            <td><a href="javascript:void(0)" class="text-primary-600">${ usuario.first_name }</a></td>
                            <td>
                            <div class="d-flex align-items-center">
                                <h6 class="text-md mb-0 fw-medium flex-grow-1">${ usuario.username }</h6>
                            </div>
                            </td>
                            <td>${ usuario.email }</td>
                            <td>
                                ${usuario.is_active == 1 ? 
                                    '<a href="" class="btn btn-success-500 text-white radius-8 px-14 py-6 text-sm">Activo</a>' : 
                                    '<a href="" class="btn btn-danger-600 text-white radius-8 px-14 py-6 text-sm">Desactivo</a>'
                                }
                            </td>
                            <td>${ usuario.date_joined }</td>
                            <td>
                            <a href="javascript:void(0)"
                                class="w-32-px h-32-px bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center">
                                <iconify-icon icon="iconamoon:eye-light"></iconify-icon>
                            </a>
                            <a href="javascript:void(0)"
                                class="w-32-px h-32-px bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center">
                                <iconify-icon icon="lucide:edit"></iconify-icon>
                            </a>
                            <a href="javascript:void(0)"
                                class="w-32-px h-32-px bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center">
                                <iconify-icon icon="mingcute:delete-2-line"></iconify-icon>
                            </a>
                            </td>
                        </tr>
                    `);
                });


            },
            error: function(error){
                console.error("Error:", error);
            }
        });
    }

    cargarUsuarios();
});
