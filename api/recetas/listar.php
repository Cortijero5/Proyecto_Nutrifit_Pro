<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../clases/Receta.php';

try {
    $recetaObj = new Receta();

    $recetas = $recetaObj->listarTodas();

    echo json_encode($recetas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Ha ocurrido un error al cargar las recetas.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
