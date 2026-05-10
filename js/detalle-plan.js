// Cuando el documento esté cargado, cargamos el detalle del plan
document.addEventListener('DOMContentLoaded', function () {
    cargarDetallePlan();
});

// Función principal para cargar el detalle de un plan
function cargarDetallePlan() {
    const contenedor = document.getElementById('detalle-plan');

    if (!contenedor) {
        return;
    }

    // Leemos el id que viene en la URL
    // Ejemplo: DetallePlan.html?id=1
    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get('id');

    if (!id) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">
                No se ha indicado ningún plan.
            </div>
        `;
        return;
    }

    const url = API.planes.detalle + '?id=' + encodeURIComponent(id);

    fetch(url)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (plan) {
            pintarDetallePlan(plan);
        })
        .catch(function (error) {
            console.error('Error al cargar el detalle del plan:', error);

            contenedor.innerHTML = `
                <div class="alert alert-danger">
                    Ha ocurrido un error al cargar el plan.
                </div>
            `;
        });
}

// Función que pinta el detalle del plan
function pintarDetallePlan(plan) {
    const contenedor = document.getElementById('detalle-plan');

    if (!contenedor) {
        return;
    }

    if (plan.error) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">
                ${plan.mensaje}
            </div>
        `;
        return;
    }

    document.title = plan.nombre + ' | NutriFit Pro';

    let textoPremium = 'Gratuito';

    if (parseInt(plan.es_premium) === 1) {
        textoPremium = 'Premium';
    }

    let listaRecetas = '';

    plan.recetas.forEach(function (receta) {
        listaRecetas += `
            <li class="list-group-item px-0">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                        <strong>${receta.dia} - ${receta.comida}</strong><br>
                        <span>${receta.nombre}</span>
                        <span class="text-muted">(${receta.tipo})</span>
                    </div>

                    <div>
                        <a href="${BASE_URL}paginas/DetalleReceta.html?id=${receta.id_receta}" 
                           class="btn btn-sm btn-naranja">
                            Ver receta
                        </a>
                    </div>
                </div>
            </li>
        `;
    });

    contenedor.innerHTML = `
        <section class="mb-5">
            <h2 class="fuente-encabezado mb-3">${plan.nombre}</h2>
            <p class="texto-secundario mb-0">${plan.descripcion}</p>
        </section>

        <section class="mb-4">
            <div class="card border-0 shadow-sm rounded-4">
                <div class="card-body p-4">
                    <h3 class="fuente-encabezado h4 mb-3">Objetivo</h3>
                    <p class="mb-0 texto-secundario">
                        ${plan.objetivo}
                    </p>
                </div>
            </div>
        </section>

        <section class="mb-4">
            <div class="card border-0 shadow-sm rounded-4">
                <div class="card-body p-4">
                    <h3 class="fuente-encabezado h4 mb-3">Tipo de plan</h3>
                    <p class="mb-0 texto-secundario">
                        ${textoPremium}
                    </p>
                </div>
            </div>
        </section>

        <section class="mb-4">
            <div class="card border-0 shadow-sm rounded-4">
                <div class="card-body p-4">
                    <h3 class="fuente-encabezado h4 mb-3">Recetas del plan</h3>

                    <ul class="list-group list-group-flush">
                        ${listaRecetas}
                    </ul>
                </div>
            </div>
        </section>

        <section class="mb-4">
            <div class="alert alerta-nota mb-0" role="note">
                <h3 class="fuente-encabezado h5 mb-2">Nota</h3>
                <p class="mb-0">
                    Este plan es orientativo y no sustituye el asesoramiento de un profesional de la nutrición.
                </p>
            </div>
        </section>

        <a href="${BASE_URL}paginas/Planes.html" class="btn btn-naranja">
            Volver a planes
        </a>
    `;
}