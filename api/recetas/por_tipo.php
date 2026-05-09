<?php

// Indicamos que este archivo devuelve JSON
header('Content-Type: application/json; charset=utf-8');

// Importamos la clase Receta
require_once __DIR__ . '/../../clases/Receta.php';

try {
    // Comprobamos si nos han pasado el tipo por la URL
    if (!isset($_GET['tipo'])) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha indicado el tipo de receta.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Guardamos el tipo recibido por GET
    $tipo = $_GET['tipo'];

    // Creamos el objeto Receta
    $recetaObj = new Receta();

    // Buscamos las recetas por tipo
    $recetas = $recetaObj->listarPorTipo($tipo);

    // Si no hay recetas de ese tipo, devolvemos un mensaje controlado
    if (count($recetas) === 0) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se han encontrado recetas de ese tipo.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Devolvemos las recetas encontradas en JSON
    echo json_encode($recetas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    // Si algo falla, devolvemos el error en JSON
    echo json_encode([
        'error' => true,
        'mensaje' => $ex->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
