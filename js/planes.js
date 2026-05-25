document.addEventListener("DOMContentLoaded", function () {
    cargarPlanes();
});

function cargarPlanes() {
    fetch(API.planes.listar)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (planes) {
            pintarPlanes(planes);
        })
        .catch(function (error) {
            console.error("Error al cargar planes:", error);
        });
}

function pintarPlanes(planes) {
    const contenedor = document.getElementById("contenedor-planes");

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = "";

    if (planes.error) {
        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning">
                    ${escaparHTML(planes.mensaje)}
                </div>
            </div>`;
        return;
    }

    planes.forEach(function (plan) {
        const columna = document.createElement("div");
        columna.className = "col-12 col-md-6 col-lg-4";

        let textoPremium = "Gratuito";

        if (parseInt(plan.es_premium) === 1) {
            textoPremium = "Premium";
        }

        columna.innerHTML = `
            <article class="card h-100 tarjeta-plan border-0 shadow-sm">
                <div class="card-body p-4">
                    <h3 class="card-title fuente-encabezado h4">${escaparHTML(plan.nombre)}</h3>

                    <p class="card-text texto-secundario">
                        ${escaparHTML(plan.descripcion)}
                    </p>

                    <p class="mb-1">
                        <strong>Objetivo:</strong> ${escaparHTML(plan.objetivo)}
                    </p>

                    <p class="mb-3">
                        <strong>Tipo:</strong> ${escaparHTML(textoPremium)}
                    </p>

                    <a href="${BASE_URL}paginas/DetallePlan.html?id=${encodeURIComponent(plan.id_plan)}" class="btn btn-naranja">
                        Ver plan
                    </a>
                </div>
            </article>`;

        contenedor.appendChild(columna);
    });
}