<?php

// Iniciamos la sesión para poder leer los datos guardados
session_start();

// Indicamos que este archivo devuelve JSON
header('Content-Type: application/json; charset=utf-8');

try {
    // Comprobamos si existe una sesión de usuario iniciada
    if (!isset($_SESSION['id_usuario'])) {
        echo json_encode([
            'error' => true,
            'logueado' => false,
            'mensaje' => 'No hay sesión iniciada.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Si hay sesión, devolvemos los datos básicos del usuario
    echo json_encode([
        'error' => false,
        'logueado' => true,
        'usuario' => [
            'id_usuario' => $_SESSION['id_usuario'],
            'nombre' => $_SESSION['nombre'],
            'email' => $_SESSION['email'],
            'rol' => $_SESSION['rol'],
            'premium' => $_SESSION['premium']
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => $ex->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
