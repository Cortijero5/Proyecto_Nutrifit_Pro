<?php

// Indicamos que este archivo devuelve JSON
header('Content-Type: application/json; charset=utf-8');

// Importamos la clase Plan
require_once __DIR__ . '/../../clases/Plan.php';

try {
    // Creamos un objeto de la clase Plan
    $planObj = new Plan();

    // Obtenemos todos los planes desde la base de datos
    $planes = $planObj->listarTodos();

    // Convertimos el array de planes a JSON y lo mostramos
    echo json_encode($planes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    // Si ocurre algún error, devolvemos una respuesta JSON con el mensaje
    echo json_encode([
        'error' => true,
        'mensaje' => $ex->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
