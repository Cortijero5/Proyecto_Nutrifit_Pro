function prepararEventosFormularioReceta() {
    const botonMostrar = document.getElementById('btn-mostrar-form-receta');
    const botonCancelar = document.getElementById('btn-cancelar-receta');
    const formularioContenedor = document.getElementById('formulario-receta-admin');
    const formulario = document.getElementById('form-crear-receta');

    if (botonMostrar && formularioContenedor) {
        botonMostrar.addEventListener('click', function () {
            prepararModoCrearReceta();
            cerrarGestionIngredientes();
            formularioContenedor.classList.remove('d-none');
        });
    }

    if (botonCancelar && formularioContenedor && formulario) {
        botonCancelar.addEventListener('click', function () {
            prepararModoCrearReceta();
            formularioContenedor.classList.add('d-none');
        });
    }

    if (formulario) {
        formulario.addEventListener('submit', function (evento) {
            evento.preventDefault();
            guardarRecetaAdmin(formulario);
        });
    }
}

function prepararModoCrearReceta() {
    const formulario = document.getElementById('form-crear-receta');
    const tituloFormulario = document.getElementById('titulo-form-receta');
    const idReceta = document.getElementById('id-receta');

    if (formulario) {
        formulario.reset();
    }

    if (idReceta) {
        idReceta.value = '';
    }

    if (tituloFormulario) {
        tituloFormulario.textContent = 'Crear nueva receta';
    }

    limpiarMensajeAdmin();
}

function guardarRecetaAdmin(formulario) {
    const datos = new FormData(formulario);

    const idReceta = datos.get('id_receta');

    let url = API.recetas.crear;

    if (idReceta) {
        url = API.recetas.editar;
    }

    fetch(url, {
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

            const formularioContenedor = document.getElementById('formulario-receta-admin');

            if (formularioContenedor) {
                formularioContenedor.classList.add('d-none');
            }

            prepararModoCrearReceta();

            cargarRecetasAdmin();
        })
        .catch(function (error) {
            console.error('Error al guardar receta:', error);
            mostrarMensajeAdmin('Ha ocurrido un error al guardar la receta.', true);
        });
}

function cargarRecetasAdmin() {
    fetch(API.recetas.listar)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (recetas) {
            pintarRecetasAdmin(recetas);
        })
        .catch(function (error) {
            console.error('Error al cargar recetas en admin:', error);

            const contenedor = document.getElementById('contenedor-recetas-admin');

            if (contenedor) {
                contenedor.innerHTML = `
                    <div class="alert alert-danger mb-0">
                        No se han podido cargar las recetas.
                    </div>
                `;
            }
        });
}

function pintarRecetasAdmin(recetas) {
    const contenedor = document.getElementById('contenedor-recetas-admin');

    if (!contenedor) {
        return;
    }

    if (recetas.error) {
        contenedor.innerHTML = `
            <div class="alert alert-warning mb-0">
                ${escaparHTML(recetas.mensaje)}
            </div>
        `;
        return;
    }

    let filas = '';

    recetas.forEach(function (receta) {
        filas += `
            <tr>
                <td>${escaparHTML(receta.id_receta)}</td>
                <td>${escaparHTML(receta.nombre)}</td>
                <td>${escaparHTML(receta.tipo)}</td>
                <td>${escaparHTML(receta.nivel)}</td>
                <td>
                    <div class="d-flex flex-wrap gap-2">
                        <a href="${BASE_URL}paginas/DetalleReceta.html?id=${receta.id_receta}" 
                           class="btn btn-sm btn-outline-primary-custom">
                            Ver
                        </a>

                        <button type="button" 
                                class="btn btn-sm btn-secondary btn-editar-receta"
                                data-id="${receta.id_receta}">
                            Editar
                        </button>

                        <button type="button" 
                                class="btn btn-sm btn-outline-primary-custom btn-ingredientes-receta"
                                data-id="${receta.id_receta}">
                            Ingredientes
                        </button>

                        <button type="button" 
                                class="btn btn-sm btn-danger btn-eliminar-receta"
                                data-id="${receta.id_receta}"
                                data-nombre="${escaparHTML(receta.nombre)}">
                            Eliminar
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    contenedor.innerHTML = `
        <div class="table-responsive">
            <table class="table align-middle">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Nivel</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    ${filas}
                </tbody>
            </table>
        </div>
    `;

    prepararBotonesEditarReceta(recetas);
    prepararBotonesIngredientesReceta(recetas);
    prepararBotonesEliminarReceta();
}

function prepararBotonesEditarReceta(recetas) {
    const botonesEditar = document.querySelectorAll('.btn-editar-receta');

    botonesEditar.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const idReceta = boton.dataset.id;

            const receta = recetas.find(function (elemento) {
                return String(elemento.id_receta) === String(idReceta);
            });

            if (receta) {
                cerrarGestionIngredientes();
                rellenarFormularioEditarReceta(receta);
            }
        });
    });
}

function rellenarFormularioEditarReceta(receta) {
    const formularioContenedor = document.getElementById('formulario-receta-admin');
    const tituloFormulario = document.getElementById('titulo-form-receta');

    document.getElementById('id-receta').value = receta.id_receta;
    document.getElementById('nombre-receta').value = receta.nombre;
    document.getElementById('descripcion-receta').value = receta.descripcion;
    document.getElementById('tipo-receta').value = receta.tipo;
    document.getElementById('nivel-receta').value = receta.nivel;
    document.getElementById('imagen-receta').value = receta.imagen;

    if (tituloFormulario) {
        tituloFormulario.textContent = 'Editar receta';
    }

    if (formularioContenedor) {
        formularioContenedor.classList.remove('d-none');
    }

    limpiarMensajeAdmin();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function prepararBotonesEliminarReceta() {
    const botonesEliminar = document.querySelectorAll('.btn-eliminar-receta');

    botonesEliminar.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const idReceta = boton.dataset.id;
            const nombreReceta = boton.dataset.nombre;

            confirmarEliminarReceta(idReceta, nombreReceta);
        });
    });
}

function confirmarEliminarReceta(idReceta, nombreReceta) {
    const confirmar = confirm(
        '¿Seguro que quieres eliminar la receta "' + nombreReceta + '"?\n\n' +
        'Esta acción eliminará también sus relaciones con planes e ingredientes.'
    );

    if (!confirmar) {
        return;
    }

    eliminarRecetaAdmin(idReceta);
}

function eliminarRecetaAdmin(idReceta) {
    const datos = new FormData();
    datos.append('id_receta', idReceta);

    fetch(API.recetas.eliminar, {
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

            const formularioContenedor = document.getElementById('formulario-receta-admin');

            if (formularioContenedor) {
                formularioContenedor.classList.add('d-none');
            }

            prepararModoCrearReceta();
            cerrarGestionIngredientes();

            cargarRecetasAdmin();
        })
        .catch(function (error) {
            console.error('Error al eliminar receta:', error);
            mostrarMensajeAdmin('Ha ocurrido un error al eliminar la receta.', true);
        });
}