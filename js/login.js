// Cuando el documento esté cargado, preparamos el formulario de login
document.addEventListener("DOMContentLoaded", function () {
    prepararLogin();
});

function prepararLogin() {
    const formulario = document.getElementById("form-login");

    // Si la página no tiene formulario de login, no hacemos nada
    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", function (evento) {
        // Evitamos que el formulario se envíe de la forma tradicional
        evento.preventDefault();

        // Recogemos los valores escritos por el usuario
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Creamos un objeto FormData para enviar los datos por POST
        const datos = new FormData();
        datos.append("email", email);
        datos.append("password", password);

        // Enviamos la petición AJAX al endpoint de login
        fetch(API.usuarios.login, {
            method: "POST",
            body: datos,
        })
            .then(function (respuesta) {
                return respuesta.json();
            })
            .then(function (resultado) {
                gestionarRespuestaLogin(resultado);
            })
            .catch(function (error) {
                console.error("Error al iniciar sesión:", error);
                mostrarMensajeLogin(
                    "Ha ocurrido un error al conectar con el servidor.",
                    true,
                );
            });
    });
}

function gestionarRespuestaLogin(resultado) {
    if (resultado.error) {
        mostrarMensajeLogin(resultado.mensaje, true);
        return;
    }

    mostrarMensajeLogin(
        "Login correcto. Bienvenido/a, " + resultado.usuario.nombre + ".",
        false,
    );

    // Más adelante aquí podremos redirigir al perfil o al inicio
    // window.location.href = BASE_URL + 'index.html';
}

function mostrarMensajeLogin(mensaje, esError) {
    const contenedorMensaje = document.getElementById("mensaje-login");

    if (!contenedorMensaje) {
        return;
    }

    let claseAlerta = "alert-success";

    if (esError) {
        claseAlerta = "alert-danger";
    }

    contenedorMensaje.innerHTML = `
        <div class="alert ${claseAlerta}" role="alert">
            ${mensaje}
        </div>
    `;
}
