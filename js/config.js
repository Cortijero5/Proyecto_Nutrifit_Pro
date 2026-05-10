// Ruta base del proyecto dentro de localhost
const BASE_URL = '/Nutrifit_Pro/';

// Endpoints de la API REST
const API = {
    recetas: {
        listar: BASE_URL + 'api/recetas/listar.php',
        detalle: BASE_URL + 'api/recetas/detalle.php',
        porTipo: BASE_URL + 'api/recetas/por_tipo.php'
    },

    planes: {
        listar: BASE_URL + 'api/planes/listar.php',
        detalle: BASE_URL + 'api/planes/detalle.php'
    },

    usuarios: {
        login: BASE_URL + 'api/usuarios/login.php',
        sesion: BASE_URL + 'api/usuarios/sesion.php',
        logout: BASE_URL + 'api/usuarios/logout.php'
    },

    ingredientes: {
        listar: BASE_URL + 'api/ingredientes/listar.php'
    }
};