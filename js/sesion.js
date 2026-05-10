// Cuando el documento esté cargado, comprobamos si hay sesión iniciada
document.addEventListener('DOMContentLoaded', function () {
    comprobarSesion();
    prepararBotonLogout();
});

// Función que consulta al backend si hay una sesión activa
function comprobarSesion() {
    const contenedor = document.getElementById('estado-sesion');

    if (!contenedor) {
        return;
    }

    fetch(API.usuarios.sesion)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            pintarSesion(datos);
        })
        .catch(function (error) {
            console.error('Error al comprobar sesión:', error);

            contenedor.innerHTML = `
                <div class="alert alert-danger">
                    Ha ocurrido un error al comprobar la sesión.
                </div>
            `;
        });
}

// Función que pinta el estado de sesión en pantalla
function pintarSesion(datos) {
    const contenedor = document.getElementById('estado-sesion');

    if (!contenedor) {
        return;
    }

    if (!datos.logueado) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">
                No hay sesión iniciada.
            </div>
        `;

        ocultarBotonLogout();
        return;
    }

    let textoPremium = 'No';

    if (datos.usuario.premium) {
        textoPremium = 'Sí';
    }

    contenedor.innerHTML = `
        <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
                <h2 class="h4 fuente-encabezado mb-3">Sesión iniciada</h2>

                <p><strong>Nombre:</strong> ${datos.usuario.nombre}</p>
                <p><strong>Email:</strong> ${datos.usuario.email}</p>
                <p><strong>Rol:</strong> ${datos.usuario.rol}</p>
                <p class="mb-0"><strong>Premium:</strong> ${textoPremium}</p>
            </div>
        </div>
    `;

    mostrarBotonLogout();
}

// Función que prepara el botón de cerrar sesión
function prepararBotonLogout() {
    const boton = document.getElementById('btn-logout');

    if (!boton) {
        return;
    }

    boton.addEventListener('click', function () {
        cerrarSesion();
    });
}

// Función que llama al endpoint de logout
function cerrarSesion() {
    fetch(API.usuarios.logout)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            const contenedorMensaje = document.getElementById('mensaje-logout');

            if (contenedorMensaje) {
                contenedorMensaje.innerHTML = `
                    <div class="alert alert-success">
                        ${datos.mensaje}
                    </div>
                `;
            }

            // Volvemos a comprobar la sesión para actualizar la pantalla
            comprobarSesion();
        })
        .catch(function (error) {
            console.error('Error al cerrar sesión:', error);

            const contenedorMensaje = document.getElementById('mensaje-logout');

            if (contenedorMensaje) {
                contenedorMensaje.innerHTML = `
                    <div class="alert alert-danger">
                        Ha ocurrido un error al cerrar sesión.
                    </div>
                `;
            }
        });
}

function mostrarBotonLogout() {
    const boton = document.getElementById('btn-logout');

    if (boton) {
        boton.classList.remove('d-none');
    }
}

function ocultarBotonLogout() {
    const boton = document.getElementById('btn-logout');

    if (boton) {
        boton.classList.add('d-none');
    }
}