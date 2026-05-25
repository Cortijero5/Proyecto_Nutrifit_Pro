<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

try {
    if (!isset($_SESSION['id_usuario'])) {
        echo json_encode([
            'error' => true,
            'logueado' => false,
            'mensaje' => 'No hay sesión iniciada.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

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
        'logueado' => false,
        'mensaje' => 'Ha ocurrido un error al comprobar la sesión.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
