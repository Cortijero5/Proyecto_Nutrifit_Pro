<?php

// Indicamos que la respuesta será JSON
header('Content-Type: application/json; charset=utf-8');

// Iniciamos sesión para poder comprobar el usuario logueado
session_start();

// Importamos la clase Receta
require_once __DIR__ . '/../../clases/Receta.php';

// Comprobamos si hay sesión iniciada.
// En nuestro proyecto sabemos que hay sesión si existe $_SESSION['id_usuario'].
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Debes iniciar sesión para realizar esta acción.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Comprobamos si el usuario logueado es administrador
if ($_SESSION['rol'] !== 'admin') {
    echo json_encode([
        'error' => true,
        'mensaje' => 'No tienes permisos para crear recetas.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Recogemos los datos enviados por POST
$nombre = trim($_POST['nombre'] ?? '');
$descripcion = trim($_POST['descripcion'] ?? '');
$tipo = trim($_POST['tipo'] ?? '');
$nivel = trim($_POST['nivel'] ?? '');
$imagen = trim($_POST['imagen'] ?? '');

// Validamos campos obligatorios
if ($nombre === '' || $descripcion === '' || $tipo === '' || $nivel === '' || $imagen === '') {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Todos los campos son obligatorios.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Validamos tipos permitidos
$tiposPermitidos = [
    'Alta proteína',
    'Baja en calorías',
    'Vegana',
    'Sin gluten'
];

if (!in_array($tipo, $tiposPermitidos)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'El tipo de receta no es válido.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Validamos niveles permitidos
$nivelesPermitidos = [
    'Muy fácil',
    'Fácil',
    'Media'
];

if (!in_array($nivel, $nivelesPermitidos)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'El nivel de dificultad no es válido.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Validamos el nombre de imagen de forma sencilla.
// Permitimos nombres como pollo-arroz.jpg, receta_1.png, imagen.webp, logo.svg
if (!preg_match('/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp|svg)$/', $imagen)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'El nombre de la imagen no es válido.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

try {
    // Creamos el objeto Receta
    $receta = new Receta();

    // El creador será el usuario que está logueado.
    // En este caso será el admin.
    $id_creador = $_SESSION['id_usuario'];

    // Insertamos la receta
    $id_receta = $receta->crear(
        $nombre,
        $descripcion,
        $tipo,
        $nivel,
        $imagen,
        $id_creador
    );

    // Devolvemos respuesta correcta
    echo json_encode([
        'error' => false,
        'mensaje' => 'Receta creada correctamente.',
        'id_receta' => $id_receta
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Error al crear la receta.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
