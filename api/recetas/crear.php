<?php
header('Content-Type: application/json; charset=utf-8');

session_start();

require_once __DIR__ . '/../../clases/Receta.php';

if (!isset($_SESSION['id_usuario'])) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Debes iniciar sesión para realizar esta acción.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

if ($_SESSION['rol'] !== 'admin') {
    echo json_encode([
        'error' => true,
        'mensaje' => 'No tienes permisos para crear recetas.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

$nombre = trim($_POST['nombre'] ?? '');
$descripcion = trim($_POST['descripcion'] ?? '');
$tipo = trim($_POST['tipo'] ?? '');
$nivel = trim($_POST['nivel'] ?? '');
$imagen = trim($_POST['imagen'] ?? '');

if ($nombre === '' || $descripcion === '' || $tipo === '' || $nivel === '' || $imagen === '') {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Todos los campos son obligatorios.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

$tiposPermitidos = [
    'Alta proteína',
    'Baja en calorías',
    'Vegana',
    'Sin gluten'
];

if (!in_array($tipo, $tiposPermitidos, true)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'El tipo de receta no es válido.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

$nivelesPermitidos = [
    'Muy fácil',
    'Fácil',
    'Media'
];

if (!in_array($nivel, $nivelesPermitidos, true)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'El nivel de dificultad no es válido.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

if (!preg_match('/^[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp|svg)$/', $imagen)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'El nombre de la imagen no es válido.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

try {
    $receta = new Receta();

    $id_creador = $_SESSION['id_usuario'];

    $id_receta = $receta->crear(
        $nombre,
        $descripcion,
        $tipo,
        $nivel,
        $imagen,
        $id_creador
    );

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
