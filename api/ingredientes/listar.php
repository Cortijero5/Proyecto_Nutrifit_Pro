<?php

// Indicamos que este archivo devuelve JSON
header('Content-Type: application/json; charset=utf-8');

// Importamos la clase Ingrediente
require_once __DIR__ . '/../../clases/Ingrediente.php';

try {
    // Creamos un objeto de la clase Ingrediente
    $ingredienteObj = new Ingrediente();

    // Obtenemos todos los ingredientes desde la base de datos
    $ingredientes = $ingredienteObj->listarTodos();

    // Devolvemos los ingredientes en formato JSON
    echo json_encode($ingredientes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    // Si ocurre algún error, devolvemos una respuesta JSON
    echo json_encode([
        'error' => true,
        'mensaje' => $ex->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
