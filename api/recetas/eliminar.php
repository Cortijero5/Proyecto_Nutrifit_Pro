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
        'mensaje' => 'No tienes permisos para eliminar recetas.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

// Recogemos el id enviado por POST
$id_receta = $_POST['id_receta'] ?? '';

// Validamos el id
if ($id_receta === '' || !is_numeric($id_receta)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'No se ha indicado una receta válida.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

try {
    $receta = new Receta();

    // Comprobamos que la receta exista antes de eliminarla
    $recetaExistente = $receta->obtenerPorId($id_receta);

    if (!$recetaExistente) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha encontrado ninguna receta con ese id.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    // Eliminamos la receta y sus relaciones
    $filasEliminadas = $receta->eliminar($id_receta);

    if ($filasEliminadas === 0) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha podido eliminar la receta.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    echo json_encode([
        'error' => false,
        'mensaje' => 'Receta eliminada correctamente.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Error al eliminar la receta.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
