<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

try {
    $_SESSION = [];

    session_destroy();

    echo json_encode([
        'error' => false,
        'mensaje' => 'Sesión cerrada correctamente.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Ha ocurrido un error al cerrar sesión.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
