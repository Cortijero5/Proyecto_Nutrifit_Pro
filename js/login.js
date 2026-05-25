document.addEventListener("DOMContentLoaded", function () {
    prepararLogin();
});

function prepararLogin() {
    const formulario = document.getElementById("form-login");

    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const datos = new FormData();
        datos.append("email", email);
        datos.append("password", password);

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
                mostrarMensajeLogin("Ha ocurrido un error al conectar con el servidor.", true);
            });
    });
}

function gestionarRespuestaLogin(resultado) {
    if (resultado.error) {
        mostrarMensajeLogin(resultado.mensaje, true);
        return;
    }

    mostrarMensajeLogin("Login correcto. Bienvenido/a, " + resultado.usuario.nombre + ".", false);

    setTimeout(function () {
        if (resultado.usuario.rol === "admin") {
            window.location.href = BASE_URL + "paginas/admin/PanelAdmin.html";
            return;
        }

        window.location.href = BASE_URL + "paginas/Suscripcion.html";
    }, 800);
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
            ${escaparHTML(mensaje)}
        </div>`;
}