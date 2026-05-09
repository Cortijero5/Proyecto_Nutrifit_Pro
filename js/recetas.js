// Cuando el documento HTML esté cargado, ejecutamos la función principal
document.addEventListener('DOMContentLoaded', function () {

    // Buscamos si la página tiene definido un tipo de receta concreto
    const contenedor = document.getElementById('contenedor-recetas');

    // Si no existe el contenedor, no hacemos nada
    if (!contenedor) {
        return;
    }

    // Leemos el tipo desde el atributo data-tipo del contenedor
    const tipo = contenedor.dataset.tipo;

    // Si hay tipo, cargamos recetas filtradas
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

// Función que recibe el array de recetas y crea las tarjetas HTML
function pintarRecetas(recetas) {
    const contenedor = document.getElementById('contenedor-recetas');

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = '';

    // Si la API devuelve un error, lo mostramos en pantalla
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
            <article class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img src="${BASE_URL}Imagenes/${receta.imagen}" 
                     class="card-img-top" 
                     alt="${receta.nombre}">

                <div class="card-body">
                    <h2 class="h5 fuente-encabezado">${receta.nombre}</h2>
                    <p class="texto-secundario">${receta.descripcion}</p>

                    <p class="mb-1"><strong>Tipo:</strong> ${receta.tipo}</p>
                    <p class="mb-3"><strong>Nivel:</strong> ${receta.nivel}</p>

                    <a href="${BASE_URL}prueba_ajax_detalle_receta.html?id=${receta.id_receta}" class="btn btn-naranja">
                    Ver receta
                    </a>
                </div>
            </article>
        `;

        contenedor.appendChild(columna);
    });
}