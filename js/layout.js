document.addEventListener("DOMContentLoaded", function () {
    cargarLayout();
});

function cargarLayout() {
    cargarComponente("header", BASE_URL + "componentes/header.html").then(
        function () {
            comprobarSesionLayout();
        },
    );

    cargarComponente("nav", BASE_URL + "componentes/nav.html").then(function () {
        comprobarSesionLayout();
        prepararBuscadorLayout();
        prepararFiltrosRecetasLayout();
    });

    cargarComponente("footer", BASE_URL + "componentes/footer.html");
}

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
            console.error(
                "Error al cargar el componente " + idContenedor + ":",
                error,
            );
        });
}

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
            console.error("Error al comprobar la sesión en el layout:", error);
        });
}

function actualizarHeaderSesion(datos) {
    const zonaUsuario = document.getElementById("zona-usuario-header");

    if (!zonaUsuario) {
        return;
    }

    if (!datos.logueado) {
        return;
    }

    zonaUsuario.innerHTML = `
        <span class="text-white fw-semibold">
            Hola, ${escaparHTML(datos.usuario.nombre)}
        </span>

        <button id="btn-logout-header" class="btn btn-sm btn-naranja">
            Cerrar sesión
        </button>`;

    const botonLogout = document.getElementById("btn-logout-header");

    if (botonLogout) {
        botonLogout.addEventListener("click", function () {
            cerrarSesionLayout();
        });
    }
}

function actualizarNavSesion(datos) {
    const enlaceAdmin = document.getElementById("enlace-admin-nav");

    if (!enlaceAdmin) {
        return;
    }

    enlaceAdmin.classList.add("d-none");

    if (datos.logueado && datos.usuario.rol === "admin") {
        enlaceAdmin.classList.remove("d-none");
    }
}

function prepararBuscadorLayout() {
    const formularioBuscador = document.querySelector(".buscador-bootstrap");

    if (!formularioBuscador) {
        return;
    }

    formularioBuscador.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const inputBusqueda = formularioBuscador.querySelector('input[name="q"]');

        if (!inputBusqueda) {
            return;
        }

        const busqueda = inputBusqueda.value.trim();

        if (busqueda === "") {
            inputBusqueda.focus();
            return;
        }

        const rutaRecetas = BASE_URL + "paginas/Recetas.html";
        const urlBusqueda =
            rutaRecetas + "?busqueda=" + encodeURIComponent(busqueda);

        if (window.location.pathname === rutaRecetas) {
            history.pushState(null, "", urlBusqueda);

            actualizarCabeceraBusqueda(busqueda);
            cargarRecetasPorBusqueda(busqueda);

            return;
        }

        window.location.href = urlBusqueda;
    });
}

function prepararFiltrosRecetasLayout() {
    const enlacesRecetas = document.querySelectorAll('a[href*="Recetas.html"]');

    enlacesRecetas.forEach(function (enlace) {
        enlace.addEventListener("click", function (evento) {
            const rutaRecetas = BASE_URL + "paginas/Recetas.html";

            if (window.location.pathname !== rutaRecetas) {
                return;
            }
            evento.preventDefault();

            const url = new URL(enlace.href);

            const tipo = url.searchParams.get("tipo");

            if (tipo) {
                history.pushState(null, "", rutaRecetas + "?tipo=" + encodeURIComponent(tipo));

                actualizarCabeceraRecetas(tipo);
                cargarRecetasPorTipo(tipo);

                return;
            }

            history.pushState(null, "", rutaRecetas);
            actualizarCabeceraRecetas();
            cargarRecetas();
        });
    });
}

function cerrarSesionLayout() {
    fetch(API.usuarios.logout)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function () {
            window.location.href = BASE_URL + "paginas/login.html";
        })
        .catch(function (error) {
            console.error("Error al cerrar sesión:", error);
        });
}
