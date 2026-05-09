<?php

// Indicamos al navegador que la respuesta será JSON y no HTML
header('Content-Type: application/json; charset=utf-8');

// Importamos la clase Receta para poder consultar la base de datos
require_once __DIR__ . '/../../clases/Receta.php';

try {
    // Creamos un objeto de la clase Receta
    $recetaObj = new Receta();

    // Obtenemos todas las recetas desde la base de datos
    $recetas = $recetaObj->listarTodas();

    // Convertimos el array de recetas a JSON y lo mostramos
    echo json_encode($recetas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    // Si ocurre algún error, devolvemos una respuesta JSON con el mensaje
    echo json_encode([
        'error' => true,
        'mensaje' => $ex->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
