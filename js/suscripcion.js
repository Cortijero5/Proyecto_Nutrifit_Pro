// Cuando el documento esté cargado, comprobamos el estado de suscripción
document.addEventListener('DOMContentLoaded', function () {
    comprobarEstadoSuscripcion();
});

// Consulta la sesión actual para adaptar el bloque premium
function comprobarEstadoSuscripcion() {
    const zonaSuscripcion = document.getElementById('zona-suscripcion');

    if (!zonaSuscripcion) {
        return;
    }

    fetch(API.usuarios.sesion)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            pintarEstadoSuscripcion(datos);
        })
        .catch(function (error) {
            console.error('Error al comprobar suscripción:', error);

            zonaSuscripcion.innerHTML = `
                <div class="alert alert-danger mb-0">
                    No se ha podido comprobar el estado de la suscripción.
                </div>
            `;
        });
}

// Pinta el contenido según si no hay sesión, si es free, premium o admin
function pintarEstadoSuscripcion(datos) {
    const zonaSuscripcion = document.getElementById('zona-suscripcion');

    if (!zonaSuscripcion) {
        return;
    }

    // Caso 1: usuario no logueado
    if (!datos.logueado) {
        zonaSuscripcion.innerHTML = `
            <div class="alert alerta-nota mb-3" role="note">
                <p class="mb-0">
                    Inicia sesión para consultar el estado de tu cuenta y acceder a futuras funciones premium.
                </p>
            </div>

            <a href="login.html" class="btn btn-naranja">
                Iniciar sesión
            </a>
        `;
        return;
    }

    // Caso 2: usuario administrador
    if (datos.usuario.rol === 'admin') {
        zonaSuscripcion.innerHTML = `
            <div class="alert alerta-nota mb-3" role="note">
                <h4 class="fuente-encabezado h5 mb-2">Sesión de administrador</h4>
                <p class="mb-0">
                    Has iniciado sesión como <strong>${escaparHTML(datos.usuario.nombre)}</strong>. 
                    Puedes gestionar contenido desde el panel de administración.
                </p>
            </div>

            <a href="admin/PanelAdmin.html" class="btn btn-naranja">
                Ir al panel admin
            </a>
        `;
        return;
    }

    // Caso 3: usuario premium
    if (datos.usuario.premium) {
        zonaSuscripcion.innerHTML = `
            <div class="alert alert-success mb-3" role="alert">
                <h4 class="fuente-encabezado h5 mb-2">Premium activo</h4>
                <p class="mb-0">
                    Hola, <strong>${escaparHTML(datos.usuario.nombre)}</strong>. 
                    Tu cuenta tiene acceso premium activo.
                </p>
            </div>

            <a href="Planes.html" class="btn btn-naranja">
                Ver planes
            </a>
        `;
        return;
    }

    // Caso 4: usuario logueado pero gratuito
    zonaSuscripcion.innerHTML = `
        <div class="alert alerta-nota mb-3" role="note">
            <h4 class="fuente-encabezado h5 mb-2">Cuenta gratuita</h4>
            <p class="mb-0">
                Hola, <strong>${escaparHTML(datos.usuario.nombre)}</strong>. 
                Actualmente tu cuenta está en modo gratuito. La mejora a premium queda preparada como funcionalidad futura.
            </p>
        </div>

        <button type="button" class="btn btn-naranja" disabled>
            Mejorar a premium próximamente
        </button>
    `;
}