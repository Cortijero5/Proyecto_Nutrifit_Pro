// Cuando el documento esté cargado, cargamos las partes comunes
document.addEventListener('DOMContentLoaded', function () {
    cargarLayout();
});

// Función principal para cargar header, nav y footer
function cargarLayout() {
    cargarComponente('header', BASE_URL + 'componentes/header.html')
        .then(function () {
            comprobarSesionLayout();
        });

    cargarComponente('nav', BASE_URL + 'componentes/nav.html')
        .then(function () {
            comprobarSesionLayout();
            prepararBuscadorLayout();
            prepararFiltrosRecetasLayout();
        });

    cargarComponente('footer', BASE_URL + 'componentes/footer.html');
}

// Función reutilizable para cargar un componente HTML dentro de un contenedor
function cargarComponente(idContenedor, url) {
    const contenedor = document.getElementById(idContenedor);

    if (!contenedor) {
        return Promise.resolve();
    }

    return fetch(url)
        .then(function (respuesta) {
            return respuesta.text();
        })
        .then(function (html) {
            contenedor.innerHTML = html;
        })
        .catch(function (error) {
            console.error('Error al cargar el componente ' + idContenedor + ':', error);
        });
}

// Función que consulta si hay sesión iniciada
function comprobarSesionLayout() {
    fetch(API.usuarios.sesion)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            actualizarHeaderSesion(datos);
            actualizarNavSesion(datos);
        })
        .catch(function (error) {
            console.error('Error al comprobar la sesión en el layout:', error);
        });
}

// Función que actualiza la zona de usuario del header
function actualizarHeaderSesion(datos) {
    const zonaUsuario = document.getElementById('zona-usuario-header');

    if (!zonaUsuario) {
        return;
    }

    // Si no hay sesión, mostramos el icono de login
    if (!datos.logueado) {
        zonaUsuario.innerHTML = `
            <a href="${BASE_URL}paginas/login.html" aria-label="Iniciar sesión">
                <i class="fa fa-user"></i>
            </a>
        `;
        return;
    }

    // Si hay sesión, mostramos saludo y botón de cerrar sesión
    zonaUsuario.innerHTML = `
        <span class="text-white fw-semibold">
            Hola, ${escaparHTML(datos.usuario.nombre)}
        </span>

        <button id="btn-logout-header" class="btn btn-sm btn-naranja">
            Cerrar sesión
        </button>
    `;

    const botonLogout = document.getElementById('btn-logout-header');

    if (botonLogout) {
        botonLogout.addEventListener('click', function () {
            cerrarSesionLayout();
        });
    }
}

// Función que actualiza opciones del nav según sesión/rol
function actualizarNavSesion(datos) {
    const enlaceAdmin = document.getElementById('enlace-admin-nav');

    if (!enlaceAdmin) {
        return;
    }

    // Ocultamos admin por defecto
    enlaceAdmin.classList.add('d-none');

    // Si está logueado y es admin, mostramos el enlace
    if (datos.logueado && datos.usuario.rol === 'admin') {
        enlaceAdmin.classList.remove('d-none');
    }
}

// Prepara el buscador del nav
function prepararBuscadorLayout() {
    const formularioBuscador = document.querySelector('.buscador-bootstrap');

    if (!formularioBuscador) {
        return;
    }

    formularioBuscador.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const inputBusqueda = formularioBuscador.querySelector('input[name="q"]');

        if (!inputBusqueda) {
            return;
        }

        const busqueda = inputBusqueda.value.trim();

        if (busqueda === '') {
            inputBusqueda.focus();
            return;
        }

        const rutaRecetas = BASE_URL + 'paginas/Recetas.html';
        const urlBusqueda = rutaRecetas + '?busqueda=' + encodeURIComponent(busqueda);

        // Si ya estamos en Recetas.html, actualizamos el contenido con AJAX sin recargar
        if (window.location.pathname === rutaRecetas) {
            history.pushState(null, '', urlBusqueda);

            if (typeof actualizarCabeceraBusqueda === 'function') {
                actualizarCabeceraBusqueda(busqueda);
            }

            if (typeof cargarRecetasPorBusqueda === 'function') {
                cargarRecetasPorBusqueda(busqueda);
            }

            return;
        }

        // Si estamos en otra página, nos lleva a Recetas.html con la búsqueda
        window.location.href = urlBusqueda;
    });
}

// Prepara los enlaces del desplegable de recetas para filtrar sin recargar en Recetas.html
function prepararFiltrosRecetasLayout() {
    const enlacesRecetas = document.querySelectorAll('a[href*="Recetas.html"]');

    enlacesRecetas.forEach(function (enlace) {
        enlace.addEventListener('click', function (evento) {
            const rutaRecetas = BASE_URL + 'paginas/Recetas.html';

            // Si no estamos en Recetas.html, dejamos que el enlace funcione normal
            if (window.location.pathname !== rutaRecetas) {
                return;
            }

            // Si estamos en Recetas.html, evitamos la recarga y cargamos por AJAX
            evento.preventDefault();

            const url = new URL(enlace.href);
            const tipo = url.searchParams.get('tipo');

            if (tipo) {
                history.pushState(null, '', rutaRecetas + '?tipo=' + encodeURIComponent(tipo));

                if (typeof actualizarCabeceraRecetas === 'function') {
                    actualizarCabeceraRecetas(tipo);
                }

                if (typeof cargarRecetasPorTipo === 'function') {
                    cargarRecetasPorTipo(tipo);
                }

                return;
            }

            // Si el enlace es "Todas las recetas"
            history.pushState(null, '', rutaRecetas);

            if (typeof actualizarCabeceraRecetas === 'function') {
                actualizarCabeceraRecetas(null);
            }

            if (typeof cargarRecetas === 'function') {
                cargarRecetas();
            }
        });
    });
}

// Función que cierra sesión desde el header
function cerrarSesionLayout() {
    fetch(API.usuarios.logout)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function () {
            // Tras cerrar sesión, mandamos al login o al inicio
            window.location.href = BASE_URL + 'paginas/login.html';
        })
        .catch(function (error) {
            console.error('Error al cerrar sesión:', error);
        });
}