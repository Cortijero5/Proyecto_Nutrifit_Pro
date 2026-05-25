<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../clases/Plan.php';

try {
    $planObj = new Plan();

    $planes = $planObj->listarTodos();

    echo json_encode($planes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Ha ocurrido un error al cargar los planes.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
