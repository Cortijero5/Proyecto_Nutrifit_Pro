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
        'mensaje' => 'No tienes permisos para modificar ingredientes de recetas.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

$id_receta = $_POST['id_receta'] ?? '';
$id_ingrediente = $_POST['id_ingrediente'] ?? '';
$cantidad = $_POST['cantidad'] ?? '';
$unidad = trim($_POST['unidad'] ?? '');

if ($id_receta === '' || !is_numeric($id_receta)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'No se ha indicado una receta válida.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($id_ingrediente === '' || !is_numeric($id_ingrediente)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'No se ha indicado un ingrediente válido.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($cantidad === '' || !is_numeric($cantidad) || floatval($cantidad) <= 0) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'La cantidad debe ser un número mayor que 0.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($unidad === '') {
    echo json_encode([
        'error' => true,
        'mensaje' => 'La unidad es obligatoria.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if (strlen($unidad) > 20) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'La unidad no puede superar los 20 caracteres.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

try {
    $receta = new Receta();

    $recetaExistente = $receta->obtenerPorId($id_receta);

    if (!$recetaExistente) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha encontrado ninguna receta con ese id.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    $receta->asociarIngrediente(
        $id_receta,
        $id_ingrediente,
        $cantidad,
        $unidad
    );

    echo json_encode([
        'error' => false,
        'mensaje' => 'Ingrediente asociado correctamente.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Error al asociar el ingrediente a la receta.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
