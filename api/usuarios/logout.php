<?php

// Iniciamos la sesión para poder destruirla
session_start();

// Indicamos que este archivo devuelve JSON
header('Content-Type: application/json; charset=utf-8');

try {
    // Vaciamos el array de sesión
    $_SESSION = [];

    // Destruimos la sesión
    session_destroy();

    // Devolvemos respuesta correcta
    echo json_encode([
        'error' => false,
        'mensaje' => 'Sesión cerrada correctamente.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => $ex->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
