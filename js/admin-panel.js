document.addEventListener("DOMContentLoaded", function () {
    comprobarAccesoAdmin();
});

function comprobarAccesoAdmin() {
    const zonaAdmin = document.getElementById("zona-admin");

    if (!zonaAdmin) {
        return;
    }

    fetch(API.usuarios.sesion)
        .then(function (respuesta) {
            return respuesta.json();
        })
        .then(function (datos) {
            if (!datos.logueado) {
                window.location.href = BASE_URL + "paginas/login.html";
                return;
            }

            if (datos.usuario.rol !== "admin") {
                zonaAdmin.innerHTML = `
                    <div class="alert alert-warning">
                        <h3 class="fuente-encabezado h5 mb-2">Acceso denegado</h3>
                        <p class="mb-0">
                            No tienes permisos para acceder al panel de administración.
                        </p>
                    </div>`;
                return;
            }

            pintarPanelAdmin(datos.usuario);
            cargarRecetasAdmin();
        })
        .catch(function (error) {
            console.error("Error al comprobar acceso admin:", error);

            zonaAdmin.innerHTML = `
                <div class="alert alert-danger">
                    Ha ocurrido un error al comprobar los permisos.
                </div>`;
        });
}

function pintarPanelAdmin(usuario) {
    const zonaAdmin = document.getElementById("zona-admin");

    zonaAdmin.innerHTML = `
        <div class="alert alerta-nota mb-4" role="note">
            <h3 class="fuente-encabezado h5 mb-2">Sesión de administrador</h3>
            <p class="mb-0">
                Has iniciado sesión como <strong>${escaparHTML(usuario.nombre)}</strong>.
            </p>
        </div>

        <section class="card border-0 shadow-sm rounded-4 mb-4">
            <div class="card-body p-4">

                <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <h3 class="fuente-encabezado h4 mb-1">Gestión de recetas</h3>
                        <p class="texto-secundario mb-0">
                            Listado de recetas guardadas en la base de datos.
                        </p>
                    </div>

                    <button type="button" id="btn-mostrar-form-receta" class="btn btn-naranja">
                        Nueva receta
                    </button>
                </div>

                <div id="mensaje-admin" class="mb-3"></div>

                <div id="formulario-receta-admin" class="d-none mb-4">
                    <div class="card border-0 shadow-sm rounded-4">
                        <div class="card-body p-4">

                            <h4 id="titulo-form-receta" class="fuente-encabezado h5 mb-3">
                                Crear nueva receta
                            </h4>

                            <form id="form-crear-receta" class="row g-3">

                                <input type="hidden" id="id-receta" name="id_receta">

                                <div class="col-12 col-md-6">
                                    <label for="nombre-receta" class="form-label">Nombre</label>
                                    <input type="text" id="nombre-receta" name="nombre" class="form-control" required>
                                </div>

                                <div class="col-12 col-md-6">
                                    <label for="imagen-receta" class="form-label">Imagen</label>
                                    <input type="text" id="imagen-receta" name="imagen" class="form-control"
                                        placeholder="ejemplo.jpg" required>
                                </div>

                                <div class="col-12">
                                    <label for="descripcion-receta" class="form-label">Descripción</label>
                                    <textarea id="descripcion-receta" name="descripcion" rows="3"
                                        class="form-control" required></textarea>
                                </div>

                                <div class="col-12 col-md-6">
                                    <label for="tipo-receta" class="form-label">Tipo</label>
                                    <select id="tipo-receta" name="tipo" class="form-select" required>
                                        <option value="">Selecciona un tipo</option>
                                        <option value="Alta proteína">Alta proteína</option>
                                        <option value="Baja en calorías">Baja en calorías</option>
                                        <option value="Vegana">Vegana</option>
                                        <option value="Sin gluten">Sin gluten</option>
                                    </select>
                                </div>

                                <div class="col-12 col-md-6">
                                    <label for="nivel-receta" class="form-label">Nivel</label>
                                    <select id="nivel-receta" name="nivel" class="form-select" required>
                                        <option value="">Selecciona un nivel</option>
                                        <option value="Muy fácil">Muy fácil</option>
                                        <option value="Fácil">Fácil</option>
                                        <option value="Media">Media</option>
                                    </select>
                                </div>

                                <div class="col-12 d-flex flex-column flex-md-row gap-2">
                                    <button type="submit" class="btn btn-naranja">
                                        Guardar receta
                                    </button>

                                    <button type="button" id="btn-cancelar-receta" class="btn btn-secondary">
                                        Cancelar
                                    </button>
                                </div>

                            </form>

                        </div>
                    </div>
                </div>

                <div id="gestion-ingredientes-admin" class="d-none mb-4">
                </div>

                <div id="contenedor-recetas-admin">
                    <div class="alert alert-info mb-0">
                        Cargando recetas...
                    </div>
                </div>

            </div>
        </section>`;

    prepararEventosFormularioReceta();
}

function cerrarGestionIngredientes() {
    const contenedor = document.getElementById("gestion-ingredientes-admin");

    if (contenedor) {
        contenedor.classList.add("d-none");
        contenedor.innerHTML = "";
    }
}

function mostrarMensajeAdmin(mensaje, esError) {
    const contenedor = document.getElementById("mensaje-admin");

    if (!contenedor) {
        return;
    }

    let clase = "alert-success";

    if (esError) {
        clase = "alert-danger";
    }

    contenedor.innerHTML = `
        <div class="alert ${clase}">
            ${escaparHTML(mensaje)}
        </div>`;
}

function limpiarMensajeAdmin() {
    const contenedor = document.getElementById("mensaje-admin");

    if (contenedor) {
        contenedor.innerHTML = "";
    }
}