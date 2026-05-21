<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../clases/Receta.php';

$id_receta = $_GET['id_receta'] ?? '';

if ($id_receta === '' || !is_numeric($id_receta)) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'No se ha indicado una receta válida.'
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

    $ingredientes = $receta->obtenerIngredientes($id_receta);

    echo json_encode($ingredientes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Error al obtener los ingredientes de la receta.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
