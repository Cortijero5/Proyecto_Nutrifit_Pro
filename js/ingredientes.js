// Cuando el documento esté cargado, cargamos los ingredientes
document.addEventListener('DOMContentLoaded', function () {
    cargarIngredientes();
});

// Función que pide los ingredientes a la API
function cargarIngredientes() {
    fetch(API.ingredientes.listar)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (ingredientes) {
            pintarIngredientes(ingredientes);
        })
        .catch(function (error) {
            console.error('Error al cargar ingredientes:', error);
        });
}

// Función que pinta los ingredientes en pantalla
function pintarIngredientes(ingredientes) {
    const contenedor = document.getElementById('contenedor-ingredientes');

    if (!contenedor) {
        return;
    }

    contenedor.innerHTML = '';

    if (ingredientes.error) {
        contenedor.innerHTML = `
            <div class="alert alert-warning">
                ${ingredientes.mensaje}
            </div>
        `;
        return;
    }

    ingredientes.forEach(function (ingrediente) {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'col-12 col-md-6 col-lg-4';

        tarjeta.innerHTML = `
            <article class="card h-100 border-0 shadow-sm rounded-4">
                <div class="card-body p-4">
                    <h2 class="h5 fuente-encabezado">${ingrediente.nombre}</h2>

                    <p class="mb-1">
                        <strong>Calorías:</strong> ${parseFloat(ingrediente.calorias_100g)} kcal / 100 g
                    </p>

                    <p class="mb-1">
                        <strong>Proteínas:</strong> ${parseFloat(ingrediente.proteinas_100g)} g / 100 g
                    </p>

                    <p class="mb-1">
                        <strong>Hidratos:</strong> ${parseFloat(ingrediente.hidratos_100g)} g / 100 g
                    </p>

                    <p class="mb-0">
                        <strong>Grasas:</strong> ${parseFloat(ingrediente.grasas_100g)} g / 100 g
                    </p>
                </div>
            </article>
        `;

        contenedor.appendChild(tarjeta);
    });
}