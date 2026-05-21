<?php

// Indicamos que la respuesta será JSON
header('Content-Type: application/json; charset=utf-8');

// Iniciamos sesión para comprobar usuario y rol
session_start();

// Importamos la clase Receta
require_once __DIR__ . '/../../clases/Receta.php';

// Comprobamos si hay sesión iniciada
if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Debes iniciar sesión para realizar esta acción.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Comprobamos si el usuario es administrador
if ($_SESSION['rol'] !== 'admin') {
    echo json_encode([
        'error' => true,
        'mensaje' => 'No tienes permisos para editar recetas.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Recogemos los datos enviados por POST
$id_receta = $_POST['id_receta'] ?? '';
$nombre = trim($_POST['nombre'] ?? '');
$descripcion = trim($_POST['descripcion'] ?? '');
$tipo = trim($_POST['tipo'] ?? '');
$nivel = trim($_POST['nivel'] ?? '');
$imagen = trim($_POST['imagen'] ?? '');

// Validamos el id
if ($id_receta === '' || !is_numeric($id_receta)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'No se ha indicado una receta válida.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

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

// Validamos nombre de imagen
if (!preg_match('/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp|svg)$/', $imagen)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'El nombre de la imagen no es válido.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

try {
    $receta = new Receta();

    // Antes de actualizar, comprobamos que la receta exista
    $recetaExistente = $receta->obtenerPorId($id_receta);

    if (!$recetaExistente) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha encontrado ninguna receta con ese id.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    // Actualizamos la receta
    $receta->actualizar(
        $id_receta,
        $nombre,
        $descripcion,
        $tipo,
        $nivel,
        $imagen
    );

    echo json_encode([
        'error' => false,
        'mensaje' => 'Receta actualizada correctamente.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Error al actualizar la receta.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
