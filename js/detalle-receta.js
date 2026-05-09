// Cuando el documento esté cargado, ejecutamos la función principal
document.addEventListener("DOMContentLoaded", function () {
    cargarDetalleReceta();
});

// Función principal para cargar el detalle de una receta
function cargarDetalleReceta() {
    const contenedor = document.getElementById("detalle-receta");

    if (!contenedor) {
        return;
    }

    // URLSearchParams permite leer los parámetros de la URL
    // Ejemplo: prueba_ajax_detalle_receta.html?id=1
    const parametros = new URLSearchParams(window.location.search);

    // Obtenemos el valor del parámetro id
    const id = parametros.get("id");

    // Si no hay id, mostramos error
    if (!id) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">
                No se ha indicado ninguna receta.
            </div>
        `;
        return;
    }

    // Construimos la URL del endpoint detalle
    const url = API.recetas.detalle + "?id=" + encodeURIComponent(id);

    fetch(url)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (receta) {
            pintarDetalleReceta(receta);
        })
        .catch(function (error) {
            console.error("Error al cargar el detalle de la receta:", error);

            contenedor.innerHTML = `
                <div class="alert alert-danger">
                    Ha ocurrido un error al cargar la receta.
                </div>
            `;
        });
}

// Función que pinta el detalle de la receta en pantalla
function pintarDetalleReceta(receta) {
    const contenedor = document.getElementById("detalle-receta");

    if (!contenedor) {
        return;
    }

    // Si la API devuelve error, lo mostramos
    if (receta.error) {
        contenedor.innerHTML = `<div class="alert alert-warning">
                ${receta.mensaje}
            </div>`;
        return;
    }

    let listaIngredientes = "";

    receta.ingredientes.forEach(function (ingrediente) {
        listaIngredientes += `
            <li>
                ${parseFloat(ingrediente.cantidad)} ${ingrediente.unidad} de ${ingrediente.nombre}
            </li>
        `;
    });

    contenedor.innerHTML = `
        <section class="mb-5 text-center">
            <h1 class="fuente-encabezado mb-3">${receta.nombre}</h1>
            <p class="texto-secundario mb-0">${receta.descripcion}</p>
        </section>

        <section class="row justify-content-center">
            <div class="col-12 col-xl-10">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="row g-0">

                        <div class="col-12 col-lg-5">
                            <img src="${BASE_URL}Imagenes/${receta.imagen}" 
                                 alt="${receta.nombre}"
                                 class="img-fluid w-100 h-100 imagen-receta-bootstrap">
                        </div>

                        <div class="col-12 col-lg-7">
                            <div class="card-body p-4 p-md-5">

                                <h2 class="fuente-encabezado h4 mb-3">Datos rápidos</h2>

                                <ul class="list-group list-group-flush mb-4">
                                    <li class="list-group-item px-0">
                                        <strong>Tipo:</strong> ${receta.tipo}
                                    </li>
                                    <li class="list-group-item px-0">
                                        <strong>Dificultad:</strong> ${receta.nivel}
                                    </li>
                                </ul>

                                <h2 class="fuente-encabezado h4 mb-3">Ingredientes</h2>

                                <ul class="mb-4 lista-receta">
                                    ${listaIngredientes}
                                </ul>

                                <a href="${BASE_URL}prueba_ajax_recetas.html" class="btn btn-naranja">
                                    Volver a recetas
                                </a>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    `;
}
