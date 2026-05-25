document.addEventListener("DOMContentLoaded", function () {
    cargarDetalleReceta();
});

function cargarDetalleReceta() {
    const contenedor = document.getElementById("detalle-receta");

    if (!contenedor) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    if (!id) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">
                No se ha indicado ninguna receta.
            </div>`;
        return;
    }

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
                </div>`;
        });
}

function pintarDetalleReceta(receta) {
    const contenedor = document.getElementById("detalle-receta");

    if (!contenedor) {
        return;
    }

    if (receta.error) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">
                ${escaparHTML(receta.mensaje)}
            </div>`;
        return;
    }

    document.title = receta.nombre + " | NutriFit Pro";

    let listaIngredientes = "";

    receta.ingredientes.forEach(function (ingrediente) {
        listaIngredientes += `
            <li>
                ${escaparHTML(parseFloat(ingrediente.cantidad))} ${escaparHTML(ingrediente.unidad)} de ${escaparHTML(ingrediente.nombre)}
            </li>`;
    });

    contenedor.innerHTML = `
        <section class="mb-5 text-center">
            <h2 class="fuente-encabezado mb-3">${escaparHTML(receta.nombre)}</h2>
            <p class="texto-secundario mb-0">${escaparHTML(receta.descripcion)}</p>
        </section>

        <section class="row justify-content-center">
            <div class="col-12 col-xl-10">

                <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="row g-0">

                        <div class="col-12 col-lg-5">
                            <img src="${BASE_URL}Imagenes/${escaparHTML(receta.imagen)}"
                                 alt="${escaparHTML(receta.nombre)}"
                                 class="img-fluid w-100 h-100 imagen-receta-bootstrap">
                        </div>

                        <div class="col-12 col-lg-7">
                            <div class="card-body p-4 p-md-5">

                                <h3 class="fuente-encabezado h4 mb-3">Datos rápidos</h3>

                                <ul class="list-group list-group-flush mb-4">
                                    <li class="list-group-item px-0">
                                        <strong>Tipo:</strong> ${escaparHTML(receta.tipo)}
                                    </li>
                                    <li class="list-group-item px-0">
                                        <strong>Dificultad:</strong> ${escaparHTML(receta.nivel)}
                                    </li>
                                </ul>

                                <h3 class="fuente-encabezado h4 mb-3">Ingredientes</h3>

                                <ul class="mb-4 lista-receta">
                                    ${listaIngredientes}
                                </ul>

                                <div class="alert alerta-nota mb-4" role="note">
                                    <h3 class="fuente-encabezado h5 mb-2">Nota</h3>
                                    <p class="mb-0">
                                        Las cantidades son orientativas y pueden adaptarse según tus necesidades.
                                    </p>
                                </div>

                                <a href="${BASE_URL}paginas/Recetas.html" class="btn btn-naranja">
                                    Volver a recetas
                                </a>

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>`;
}