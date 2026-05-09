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
    // Ejemplo: prueba_ajax_detalle_plan.html?id=1
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

    let textoPremium = 'Gratuito';

    if (parseInt(plan.es_premium) === 1) {
        textoPremium = 'Premium';
    }

    let listaRecetas = '';

    plan.recetas.forEach(function (receta) {
        listaRecetas += `
            <li class="list-group-item">
                <div class="d-flex flex-column flex-md-row justify-content-between gap-2">
                    <div>
                        <strong>${receta.dia} - ${receta.comida}</strong><br>
                        ${receta.nombre}
                        <span class="text-muted">(${receta.tipo})</span>
                    </div>

                    <div>
                        <a href="${BASE_URL}prueba_ajax_detalle_receta.html?id=${receta.id_receta}" class="btn btn-sm btn-naranja">
                            Ver receta
                        </a>
                    </div>
                </div>
            </li>
        `;
    });

    contenedor.innerHTML = `
        <section class="mb-5">
            <h1 class="fuente-encabezado mb-3">${plan.nombre}</h1>
            <p class="texto-secundario mb-0">${plan.descripcion}</p>
        </section>

        <section class="mb-4">
            <div class="card border-0 shadow-sm rounded-4">
                <div class="card-body p-4">
                    <h2 class="fuente-encabezado h4 mb-3">Datos del plan</h2>

                    <p><strong>Objetivo:</strong> ${plan.objetivo}</p>
                    <p class="mb-0"><strong>Tipo:</strong> ${textoPremium}</p>
                </div>
            </div>
        </section>

        <section class="mb-4">
            <div class="card border-0 shadow-sm rounded-4">
                <div class="card-body p-4">
                    <h2 class="fuente-encabezado h4 mb-3">Recetas del plan</h2>

                    <ul class="list-group list-group-flush">
                        ${listaRecetas}
                    </ul>
                </div>
            </div>
        </section>

        <a href="${BASE_URL}prueba_ajax_planes.html" class="btn btn-naranja">
            Volver a planes
        </a>
    `;
}