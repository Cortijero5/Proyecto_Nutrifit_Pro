function prepararBotonesIngredientesReceta(recetas) {
    const botonesIngredientes = document.querySelectorAll('.btn-ingredientes-receta');

    botonesIngredientes.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const idReceta = boton.dataset.id;

            const receta = recetas.find(function (elemento) {
                return String(elemento.id_receta) === String(idReceta);
            });

            if (receta) {
                const formularioContenedor = document.getElementById('formulario-receta-admin');

                if (formularioContenedor) {
                    formularioContenedor.classList.add('d-none');
                }

                prepararModoCrearReceta();
                mostrarGestionIngredientesReceta(receta);
            }
        });
    });
}

function mostrarGestionIngredientesReceta(receta) {
    const contenedor = document.getElementById('gestion-ingredientes-admin');

    if (!contenedor) {
        return;
    }

    contenedor.classList.remove('d-none');

    contenedor.innerHTML = `
        <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">

                <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <h4 class="fuente-encabezado h5 mb-1">
                            Ingredientes de ${escaparHTML(receta.nombre)}
                        </h4>
                        <p class="texto-secundario mb-0">
                            Asocia ingredientes existentes a esta receta indicando cantidad y unidad.
                        </p>
                    </div>

                    <button type="button" id="btn-cerrar-ingredientes" class="btn btn-secondary">
                        Cerrar
                    </button>
                </div>

                <form id="form-asociar-ingrediente" class="row g-3 mb-4">

                    <input type="hidden" id="ingrediente-id-receta" name="id_receta" value="${escaparHTML(receta.id_receta)}">

                    <div class="col-12 col-lg-5">
                        <label for="select-ingrediente" class="form-label">Ingrediente</label>
                        <select id="select-ingrediente" name="id_ingrediente" class="form-select" required>
                            <option value="">Cargando ingredientes...</option>
                        </select>
                    </div>

                    <div class="col-12 col-md-6 col-lg-3">
                        <label for="cantidad-ingrediente" class="form-label">Cantidad</label>
                        <input type="number" id="cantidad-ingrediente" name="cantidad" class="form-control"
                            min="0.01" step="0.01" placeholder="Ej: 150" required>
                    </div>

                    <div class="col-12 col-md-6 col-lg-2">
                        <label for="unidad-ingrediente" class="form-label">Unidad</label>
                        <input type="text" id="unidad-ingrediente" name="unidad" class="form-control"
                            maxlength="20" placeholder="g, ml..." required>
                    </div>

                    <div class="col-12 col-lg-2 d-flex align-items-end">
                        <button type="submit" class="btn btn-naranja w-100">
                            Añadir
                        </button>
                    </div>

                </form>

                <div id="lista-ingredientes-receta">
                    <div class="alert alert-info mb-0">
                        Cargando ingredientes de la receta...
                    </div>
                </div>

            </div>
        </div>
    `;

    prepararEventosGestionIngredientes();
    cargarSelectorIngredientes();
    cargarIngredientesRecetaAdmin(receta.id_receta);

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function prepararEventosGestionIngredientes() {
    const botonCerrar = document.getElementById('btn-cerrar-ingredientes');
    const formulario = document.getElementById('form-asociar-ingrediente');
    const contenedor = document.getElementById('gestion-ingredientes-admin');

    if (botonCerrar && contenedor) {
        botonCerrar.addEventListener('click', function () {
            cerrarGestionIngredientes();
        });
    }

    if (formulario) {
        formulario.addEventListener('submit', function (evento) {
            evento.preventDefault();
            asociarIngredienteRecetaAdmin(formulario);
        });
    }
}

function cargarSelectorIngredientes() {
    const selector = document.getElementById('select-ingrediente');

    if (!selector) {
        return;
    }

    fetch(API.ingredientes.listar)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (ingredientes) {
            if (ingredientes.error) {
                selector.innerHTML = `
                    <option value="">No se pudieron cargar ingredientes</option>
                `;
                return;
            }

            let opciones = '<option value="">Selecciona un ingrediente</option>';

            ingredientes.forEach(function (ingrediente) {
                opciones += `
                    <option value="${escaparHTML(ingrediente.id_ingrediente)}">
                        ${escaparHTML(ingrediente.nombre)}
                    </option>
                `;
            });

            selector.innerHTML = opciones;
        })
        .catch(function (error) {
            console.error('Error al cargar selector de ingredientes:', error);

            selector.innerHTML = `
                <option value="">Error al cargar ingredientes</option>
            `;
        });
}

function cargarIngredientesRecetaAdmin(idReceta) {
    const contenedor = document.getElementById('lista-ingredientes-receta');

    if (!contenedor) {
        return;
    }

    const url = API.recetas.ingredientes + '?id_receta=' + encodeURIComponent(idReceta);

    fetch(url)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (ingredientes) {
            pintarIngredientesRecetaAdmin(idReceta, ingredientes);
        })
        .catch(function (error) {
            console.error('Error al cargar ingredientes de la receta:', error);

            contenedor.innerHTML = `
                <div class="alert alert-danger mb-0">
                    No se han podido cargar los ingredientes de la receta.
                </div>
            `;
        });
}

function pintarIngredientesRecetaAdmin(idReceta, ingredientes) {
    const contenedor = document.getElementById('lista-ingredientes-receta');

    if (!contenedor) {
        return;
    }

    if (ingredientes.error) {
        contenedor.innerHTML = `
            <div class="alert alert-warning mb-0">
                ${escaparHTML(ingredientes.mensaje)}
            </div>
        `;
        return;
    }

    if (ingredientes.length === 0) {
        contenedor.innerHTML = `
            <div class="alert alert-light border mb-0">
                Esta receta todavía no tiene ingredientes asociados.
            </div>
        `;
        return;
    }

    let filas = '';

    ingredientes.forEach(function (ingrediente) {
        filas += `
            <tr>
                <td>${escaparHTML(ingrediente.nombre)}</td>
                <td>${escaparHTML(ingrediente.cantidad)} ${escaparHTML(ingrediente.unidad)}</td>
                <td>${escaparHTML(ingrediente.calorias_100g)} kcal</td>
                <td>${escaparHTML(ingrediente.proteinas_100g)} g</td>
                <td>${escaparHTML(ingrediente.hidratos_100g)} g</td>
                <td>${escaparHTML(ingrediente.grasas_100g)} g</td>
                <td>
                    <button type="button"
                            class="btn btn-sm btn-danger btn-eliminar-ingrediente-receta"
                            data-id-receta="${escaparHTML(idReceta)}"
                            data-id-ingrediente="${escaparHTML(ingrediente.id_ingrediente)}">
                        Quitar
                    </button>
                </td>
            </tr>
        `;
    });

    contenedor.innerHTML = `
        <div class="table-responsive">
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>Ingrediente</th>
                        <th>Cantidad</th>
                        <th>Kcal/100g</th>
                        <th>Proteínas</th>
                        <th>Hidratos</th>
                        <th>Grasas</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    ${filas}
                </tbody>
            </table>
        </div>
    `;

    prepararBotonesEliminarIngredienteReceta();
}

function asociarIngredienteRecetaAdmin(formulario) {
    const datos = new FormData(formulario);
    const idReceta = datos.get('id_receta');

    fetch(API.recetas.asociarIngrediente, {
        method: 'POST',
        body: datos
    })
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (resultado) {
            if (resultado.error) {
                mostrarMensajeAdmin(resultado.mensaje, true);
                return;
            }

            mostrarMensajeAdmin(resultado.mensaje, false);

            formulario.reset();

            cargarIngredientesRecetaAdmin(idReceta);
        })
        .catch(function (error) {
            console.error('Error al asociar ingrediente:', error);
            mostrarMensajeAdmin('Ha ocurrido un error al asociar el ingrediente.', true);
        });
}

function prepararBotonesEliminarIngredienteReceta() {
    const botones = document.querySelectorAll('.btn-eliminar-ingrediente-receta');

    botones.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const idReceta = boton.dataset.idReceta;
            const idIngrediente = boton.dataset.idIngrediente;

            eliminarIngredienteRecetaAdmin(idReceta, idIngrediente);
        });
    });
}

function eliminarIngredienteRecetaAdmin(idReceta, idIngrediente) {
    const confirmar = confirm('¿Seguro que quieres quitar este ingrediente de la receta?');

    if (!confirmar) {
        return;
    }

    const datos = new FormData();
    datos.append('id_receta', idReceta);
    datos.append('id_ingrediente', idIngrediente);

    fetch(API.recetas.eliminarIngrediente, {
        method: 'POST',
        body: datos
    })
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (resultado) {
            if (resultado.error) {
                mostrarMensajeAdmin(resultado.mensaje, true);
                return;
            }

            mostrarMensajeAdmin(resultado.mensaje, false);

            cargarIngredientesRecetaAdmin(idReceta);
        })
        .catch(function (error) {
            console.error('Error al eliminar ingrediente de receta:', error);
            mostrarMensajeAdmin('Ha ocurrido un error al quitar el ingrediente.', true);
        });
}