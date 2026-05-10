// Guardamos aquí todos los ingredientes cargados desde la API
let ingredientesDisponibles = [];

// Guardamos aquí los ingredientes que el usuario va añadiendo a la calculadora
let ingredientesSeleccionados = [];

// Cuando cargue el documento, iniciamos la calculadora
document.addEventListener('DOMContentLoaded', function () {
    cargarIngredientesCalculadora();
    prepararFormularioCalculadora();
});

// Función que pide los ingredientes a la API
function cargarIngredientesCalculadora() {
    fetch(API.ingredientes.listar)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (ingredientes) {
            ingredientesDisponibles = ingredientes;
            rellenarSelectIngredientes(ingredientes);
        })
        .catch(function (error) {
            console.error('Error al cargar ingredientes:', error);
        });
}

// Función que rellena el select con los ingredientes
function rellenarSelectIngredientes(ingredientes) {
    const select = document.getElementById('ingrediente');

    if (!select) {
        return;
    }

    select.innerHTML = '<option value="">Selecciona un ingrediente</option>';

    ingredientes.forEach(function (ingrediente) {
        const opcion = document.createElement('option');

        opcion.value = ingrediente.id_ingrediente;
        opcion.textContent = ingrediente.nombre;

        select.appendChild(opcion);
    });
}

// Función que prepara el formulario de la calculadora
function prepararFormularioCalculadora() {
    const formulario = document.getElementById('form-calculadora');

    if (!formulario) {
        return;
    }

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        agregarIngrediente();
    });
}

// Función que añade un ingrediente a la lista
function agregarIngrediente() {
    const select = document.getElementById('ingrediente');
    const inputCantidad = document.getElementById('cantidad');

    const idIngrediente = select.value;
    const cantidad = parseFloat(inputCantidad.value);

    if (!idIngrediente) {
        mostrarMensajeCalculadora('Debes seleccionar un ingrediente.', true);
        return;
    }

    if (isNaN(cantidad) || cantidad <= 0) {
        mostrarMensajeCalculadora('Debes introducir una cantidad válida en gramos.', true);
        return;
    }

    const ingrediente = ingredientesDisponibles.find(function (item) {
        return item.id_ingrediente == idIngrediente;
    });

    if (!ingrediente) {
        mostrarMensajeCalculadora('No se ha encontrado el ingrediente seleccionado.', true);
        return;
    }

    const ingredienteCalculado = calcularValoresIngrediente(ingrediente, cantidad);

    ingredientesSeleccionados.push(ingredienteCalculado);

    pintarIngredientesSeleccionados();
    calcularTotales();

    mostrarMensajeCalculadora('Ingrediente añadido correctamente.', false);

    select.value = '';
    inputCantidad.value = '';
}

// Función que calcula los valores nutricionales según la cantidad introducida
function calcularValoresIngrediente(ingrediente, cantidad) {
    return {
        id_ingrediente: ingrediente.id_ingrediente,
        nombre: ingrediente.nombre,
        cantidad: cantidad,
        calorias: parseFloat(ingrediente.calorias_100g) * cantidad / 100,
        proteinas: parseFloat(ingrediente.proteinas_100g) * cantidad / 100,
        hidratos: parseFloat(ingrediente.hidratos_100g) * cantidad / 100,
        grasas: parseFloat(ingrediente.grasas_100g) * cantidad / 100
    };
}

// Función que pinta la lista de ingredientes añadidos
function pintarIngredientesSeleccionados() {
    const contenedor = document.getElementById('lista-ingredientes');

    if (!contenedor) {
        return;
    }

    if (ingredientesSeleccionados.length === 0) {
        contenedor.innerHTML = `
            <div class="alert alert-info">
                Todavía no has añadido ingredientes.
            </div>
        `;
        return;
    }

    let html = '<ul class="list-group">';

    ingredientesSeleccionados.forEach(function (ingrediente, indice) {
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-start gap-3">
                <div>
                    <strong>${ingrediente.nombre}</strong><br>
                    ${ingrediente.cantidad} g -
                    ${ingrediente.calorias.toFixed(1)} kcal
                    <br>
                    <small>
                        Proteínas: ${ingrediente.proteinas.toFixed(1)} g |
                        Hidratos: ${ingrediente.hidratos.toFixed(1)} g |
                        Grasas: ${ingrediente.grasas.toFixed(1)} g
                    </small>
                </div>

                <button class="btn btn-sm btn-outline-danger" onclick="eliminarIngrediente(${indice})">
                    Eliminar
                </button>
            </li>
        `;
    });

    html += '</ul>';

    contenedor.innerHTML = html;
}

// Función para eliminar un ingrediente de la lista
function eliminarIngrediente(indice) {
    ingredientesSeleccionados.splice(indice, 1);

    pintarIngredientesSeleccionados();
    calcularTotales();
}

// Función que calcula y pinta los totales
function calcularTotales() {
    const contenedor = document.getElementById('totales-calculadora');

    if (!contenedor) {
        return;
    }

    let totalCalorias = 0;
    let totalProteinas = 0;
    let totalHidratos = 0;
    let totalGrasas = 0;

    ingredientesSeleccionados.forEach(function (ingrediente) {
        totalCalorias += ingrediente.calorias;
        totalProteinas += ingrediente.proteinas;
        totalHidratos += ingrediente.hidratos;
        totalGrasas += ingrediente.grasas;
    });

    contenedor.innerHTML = `
        <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
                <h2 class="h4 fuente-encabezado mb-3">Totales</h2>

                <p><strong>Calorías:</strong> ${totalCalorias.toFixed(1)} kcal</p>
                <p><strong>Proteínas:</strong> ${totalProteinas.toFixed(1)} g</p>
                <p><strong>Hidratos:</strong> ${totalHidratos.toFixed(1)} g</p>
                <p class="mb-0"><strong>Grasas:</strong> ${totalGrasas.toFixed(1)} g</p>
            </div>
        </div>
    `;
}

// Función para mostrar mensajes
function mostrarMensajeCalculadora(mensaje, esError) {
    const contenedor = document.getElementById('mensaje-calculadora');

    if (!contenedor) {
        return;
    }

    let clase = 'alert-success';

    if (esError) {
        clase = 'alert-danger';
    }

    contenedor.innerHTML = `
        <div class="alert ${clase}">
            ${mensaje}
        </div>
    `;
}