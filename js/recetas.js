// Cuando el documento HTML esté cargado, ejecutamos la función principal
document.addEventListener('DOMContentLoaded', function () {

    const contenedor = document.getElementById('contenedor-recetas');

    if (!contenedor) {
        return;
    }

    // Leemos los parámetros de la URL.
    // Ejemplo: Recetas.html?tipo=Vegana
    const parametros = new URLSearchParams(window.location.search);
    const tipo = parametros.get('tipo');

    actualizarCabeceraRecetas(tipo);

    if (tipo) {
        cargarRecetasPorTipo(tipo);
    } else {
        cargarRecetas();
    }
});

// Función que pide todas las recetas a la API
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

// Función que pide recetas filtradas por tipo
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

// Función que cambia el título y descripción según el tipo
function actualizarCabeceraRecetas(tipo) {
    const titulo = document.getElementById('titulo-recetas');
    const descripcion = document.getElementById('descripcion-recetas');

    if (!titulo || !descripcion) {
        return;
    }

    if (!tipo) {
        titulo.textContent = 'Todas las recetas';
        descripcion.textContent = 'Explora todas las recetas disponibles en NutriFit Pro.';
        return;
    }

    if (tipo === 'Alta proteína') {
        titulo.textContent = 'Recetas altas en proteína';
        descripcion.textContent = 'Recetas orientadas a rendimiento y ganancia muscular: fáciles, rápidas y con ingredientes comunes.';
    } else if (tipo === 'Baja en calorías') {
        titulo.textContent = 'Recetas bajas en calorías';
        descripcion.textContent = 'Opciones ligeras, saciantes y pensadas para controlar calorías sin complicarte.';
    } else if (tipo === 'Vegana') {
        titulo.textContent = 'Recetas veganas';
        descripcion.textContent = 'Recetas 100% vegetales, equilibradas y fáciles: pensadas para el día a día y adaptables a tus macros.';
    } else if (tipo === 'Sin gluten') {
        titulo.textContent = 'Recetas sin gluten';
        descripcion.textContent = 'Recetas aptas para evitar gluten, con alimentos sencillos y preparaciones prácticas.';
    } else {
        titulo.textContent = 'Recetas';
        descripcion.textContent = 'Explora las recetas disponibles en NutriFit Pro.';
    }
}

// Función que recibe el array de recetas y crea las tarjetas HTML
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
                    ${recetas.mensaje}
                </div>
            </div>
        `;
        return;
    }

    recetas.forEach(function (receta) {
        const columna = document.createElement('div');
        columna.className = 'col-12 col-md-6 col-lg-4';

        columna.innerHTML = `
            <article class="card h-100 tarjeta-plan border-0 shadow-sm">
                <a href="${BASE_URL}paginas/DetalleReceta.html?id=${receta.id_receta}" 
                   class="text-decoration-none text-reset h-100"
                   aria-label="Ver receta: ${receta.nombre}">

                    <img src="${BASE_URL}Imagenes/${receta.imagen}" 
                         class="card-img-top imagen-card" 
                         alt="${receta.nombre}">

                    <div class="card-body">
                        <h3 class="card-title fuente-encabezado h4">${receta.nombre}</h3>
                        <p class="card-text texto-secundario">
                            ${receta.nivel} · ${receta.tipo}
                        </p>
                    </div>
                </a>
            </article>
        `;

        contenedor.appendChild(columna);
    });
}