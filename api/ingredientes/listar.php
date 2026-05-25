<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../clases/Ingrediente.php';

try {
    $ingredienteObj = new Ingrediente();

    $ingredientes = $ingredienteObj->listarTodos();

    echo json_encode($ingredientes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Ha ocurrido un error al cargar los ingredientes.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
