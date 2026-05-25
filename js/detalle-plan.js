document.addEventListener("DOMContentLoaded", function () {
    cargarDetallePlan();
});

function cargarDetallePlan() {
    const contenedor = document.getElementById("detalle-plan");

    if (!contenedor) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");

    if (!id) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">
                No se ha indicado ningún plan.
            </div>`;
        return;
    }

    const url = API.planes.detalle + "?id=" + encodeURIComponent(id);

    fetch(url)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (plan) {
            pintarDetallePlan(plan);
        })
        .catch(function (error) {
            console.error("Error al cargar el detalle del plan:", error);

            contenedor.innerHTML = `
                <div class="alert alert-danger">
                    Ha ocurrido un error al cargar el plan.
                </div>`;
        });
}

function pintarDetallePlan(plan) {
    const contenedor = document.getElementById("detalle-plan");

    if (!contenedor) {
        return;
    }

    if (plan.error) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">
                ${escaparHTML(plan.mensaje)}
            </div>`;
        return;
    }

    document.title = plan.nombre + " | NutriFit Pro";

    let textoPremium = "Gratuito";

    if (parseInt(plan.es_premium) === 1) {
        textoPremium = "Premium";
    }

    const recetasPorDia = agruparRecetasPorDia(plan.recetas);
    const tarjetasDias = pintarTarjetasDias(recetasPorDia);

    contenedor.innerHTML = `
        <section class="mb-5">
            <h2 class="fuente-encabezado mb-3">${escaparHTML(plan.nombre)}</h2>
            <p class="texto-secundario mb-0">${escaparHTML(plan.descripcion)}</p>
        </section>

        <section class="row g-4 mb-4">
            <div class="col-12 col-lg-6">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body p-4">
                        <h3 class="fuente-encabezado h4 mb-3">Objetivo</h3>
                        <p class="mb-0 texto-secundario">
                            ${escaparHTML(capitalizarPrimeraLetra(plan.objetivo))}
                        </p>
                    </div>
                </div>
            </div>

            <div class="col-12 col-lg-6">
                <div class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body p-4">
                        <h3 class="fuente-encabezado h4 mb-3">Tipo de plan</h3>
                        <p class="mb-0 texto-secundario">
                            ${escaparHTML(textoPremium)}
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section class="mb-4">
            <h3 class="fuente-encabezado h4 mb-4">Plan semanal</h3>

            <div class="row g-4">
                ${tarjetasDias}
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
        </a>`;
}

function agruparRecetasPorDia(recetas) {
    const recetasPorDia = {};

    recetas.forEach(function (receta) {
        const dia = receta.dia;

        if (!recetasPorDia[dia]) {
            recetasPorDia[dia] = [];
        }

        recetasPorDia[dia].push(receta);
    });

    return recetasPorDia;
}

function pintarTarjetasDias(recetasPorDia) {
    const ordenDias = [
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
        "domingo",
    ];

    let tarjetas = "";

    ordenDias.forEach(function (dia) {
        const recetasDia = recetasPorDia[dia] || [];

        tarjetas += `
            <div class="col-12 col-lg-6">
                <article class="card border-0 shadow-sm rounded-4 h-100">
                    <div class="card-body p-4">
                        <h4 class="fuente-encabezado h5 mb-3">
                            ${escaparHTML(capitalizarPrimeraLetra(dia))}
                        </h4>

                        ${pintarComidasDia(recetasDia)}
                    </div>
                </article>
            </div>`;
    });

    return tarjetas;
}

function pintarComidasDia(recetasDia) {
    const ordenComidas = [
        "desayuno",
        "comida",
        "merienda",
        "cena",
    ];

    if (recetasDia.length === 0) {
        return `
            <div class="alert alert-light border mb-0">
                No hay recetas asignadas para este día.
            </div>`;
    }

    let htmlComidas = '<div class="d-flex flex-column gap-3">';

    ordenComidas.forEach(function (comida) {
        const recetaComida = recetasDia.find(function (receta) {
            return receta.comida === comida;
        });

        if (recetaComida) {
            htmlComidas += `
                <div class="border rounded-4 p-3">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <div>
                            <p class="mb-1 fw-bold">
                                ${escaparHTML(capitalizarPrimeraLetra(comida))}
                            </p>

                            <p class="mb-1">
                                ${escaparHTML(recetaComida.nombre)}
                            </p>

                            <p class="mb-0 texto-secundario small">
                                ${escaparHTML(recetaComida.tipo)}
                            </p>
                        </div>

                        <div>
                            <a href="${BASE_URL}paginas/DetalleReceta.html?id=${encodeURIComponent(recetaComida.id_receta)}"
                               class="btn btn-sm btn-naranja">
                                Ver receta
                            </a>
                        </div>
                    </div>
                </div>`;
        } else {
            htmlComidas += `
                <div class="border rounded-4 p-3 bg-light">
                    <p class="mb-0 texto-secundario">
                        <strong>${escaparHTML(capitalizarPrimeraLetra(comida))}:</strong> sin receta asignada.
                    </p>
                </div>`;
        }
    });

    htmlComidas += "</div>";

    return htmlComidas;
}

function capitalizarPrimeraLetra(texto) {
    if (!texto) {
        return "";
    }

    return texto.charAt(0).toUpperCase() + texto.slice(1);
}