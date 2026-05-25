const BASE_URL = '/Nutrifit_Pro/';

const API = {
    recetas: {
        listar: BASE_URL + 'api/recetas/listar.php',
        detalle: BASE_URL + 'api/recetas/detalle.php',
        porTipo: BASE_URL + 'api/recetas/por_tipo.php',
        crear: BASE_URL + 'api/recetas/crear.php',
        buscar: BASE_URL + 'api/recetas/buscar.php',
        editar: BASE_URL + 'api/recetas/editar.php',
        eliminar: BASE_URL + 'api/recetas/eliminar.php',
        ingredientes: BASE_URL + 'api/recetas/ingredientes.php',
        asociarIngrediente: BASE_URL + 'api/recetas/asociar_ingrediente.php',
        eliminarIngrediente: BASE_URL + 'api/recetas/eliminar_ingrediente.php'
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