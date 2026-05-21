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

try {
    $receta = new Receta();

    $filasEliminadas = $receta->eliminarIngrediente($id_receta, $id_ingrediente);

    if ($filasEliminadas === 0) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha encontrado esa relación entre receta e ingrediente.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    echo json_encode([
        'error' => false,
        'mensaje' => 'Ingrediente eliminado de la receta correctamente.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Error al eliminar el ingrediente de la receta.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
