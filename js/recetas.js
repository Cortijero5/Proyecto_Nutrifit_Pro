document.addEventListener('DOMContentLoaded', function () {

    const contenedor = document.getElementById('contenedor-recetas');

    if (!contenedor) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const tipo = parametros.get('tipo');
    const busqueda = parametros.get('busqueda');

    if (busqueda) {
        actualizarCabeceraBusqueda(busqueda);
        cargarRecetasPorBusqueda(busqueda);
    } else if (tipo) {
        actualizarCabeceraRecetas(tipo);
        cargarRecetasPorTipo(tipo);
    } else {
        actualizarCabeceraRecetas();
        cargarRecetas();
    }
});

function cargarRecetas() {
    fetch(API.recetas.listar)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (recetas) {
            pintarRecetas(recetas);
        })
        .catch(function (error) {
            console.error('Error al cargar recetas:', error);
        });
}

function cargarRecetasPorTipo(tipo) {
    const url = API.recetas.porTipo + '?tipo=' + encodeURIComponent(tipo);

    fetch(url)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (recetas) {
            pintarRecetas(recetas);
        })
        .catch(function (error) {
            console.error('Error al cargar recetas por tipo:', error);
        });
}

function cargarRecetasPorBusqueda(busqueda) {
    const url = API.recetas.buscar + '?busqueda=' + encodeURIComponent(busqueda);

    fetch(url)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (recetas) {
            pintarRecetas(recetas);
        })
        .catch(function (error) {
            console.error('Error al buscar recetas:', error);
        });
}

function actualizarCabeceraRecetas(tipo) {
    const titulo = document.getElementById('titulo-recetas');
    const descripcion = document.getElementById('descripcion-recetas');

    if (!titulo || !descripcion) {
        return;
    }

    switch (tipo) {
        case 'Alta proteína':
            titulo.textContent = 'Recetas altas en proteína';
            descripcion.textContent = 'Recetas orientadas a rendimiento y ganancia muscular: fáciles, rápidas y con ingredientes comunes.';
            break;

        case 'Baja en calorías':
            titulo.textContent = 'Recetas bajas en calorías';
            descripcion.textContent = 'Opciones ligeras, saciantes y pensadas para controlar calorías sin complicarte.';
            break;

        case 'Vegana':
            titulo.textContent = 'Recetas veganas';
            descripcion.textContent = 'Recetas 100% vegetales, equilibradas y fáciles: pensadas para el día a día y adaptables a tus macros.';
            break;

        case 'Sin gluten':
            titulo.textContent = 'Recetas sin gluten';
            descripcion.textContent = 'Recetas aptas para evitar gluten, con alimentos sencillos y preparaciones prácticas.';
            break;

        default:
            titulo.textContent = 'Todas las recetas';
            descripcion.textContent = 'Explora todas las recetas disponibles en NutriFit Pro.';
            break;
    }
}

function actualizarCabeceraBusqueda(busqueda) {
    const titulo = document.getElementById('titulo-recetas');
    const descripcion = document.getElementById('descripcion-recetas');

    if (!titulo || !descripcion) {
        return;
    }

    titulo.textContent = 'Resultados de búsqueda';
    descripcion.textContent = 'Resultados encontrados para: "' + busqueda + '".';
}

function pintarRecetas(recetas) {
    const contenedor = document.getElementById('contenedor-recetas');

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = '';

    if (recetas.error) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    ${escaparHTML(recetas.mensaje)}
                </div>
            </div>`;
        return;
    }

    recetas.forEach(function (receta) {
        const columna = document.createElement('div');
        columna.className = 'col-12 col-md-6 col-lg-4';

        columna.innerHTML = `
            <article class="card h-100 tarjeta-plan border-0 shadow-sm">
                <a href="${BASE_URL}paginas/DetalleReceta.html?id=${encodeURIComponent(receta.id_receta)}" 
                   class="text-decoration-none text-reset h-100"
                   aria-label="Ver receta: ${escaparHTML(receta.nombre)}">

                    <img src="${BASE_URL}Imagenes/${escaparHTML(receta.imagen)}" 
                         class="card-img-top imagen-card" 
                         alt="${escaparHTML(receta.nombre)}">

                    <div class="card-body">
                        <h3 class="card-title fuente-encabezado h4">${escaparHTML(receta.nombre)}</h3>
                        <p class="card-text texto-secundario">
                            ${escaparHTML(receta.nivel)} · ${escaparHTML(receta.tipo)}
                        </p>
                    </div>
                </a>
            </article>`;

        contenedor.appendChild(columna);
    });
}