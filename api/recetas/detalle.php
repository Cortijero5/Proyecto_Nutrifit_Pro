<?php

// Indicamos que este archivo devuelve JSON
header('Content-Type: application/json; charset=utf-8');

// Importamos la clase Receta
require_once __DIR__ . '/../../clases/Receta.php';

try {
    // Comprobamos si nos han pasado el id por la URL
    if (!isset($_GET['id'])) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha indicado el id de la receta.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Guardamos el id recibido por GET
    $id_receta = $_GET['id'];

    // Creamos el objeto Receta
    $recetaObj = new Receta();

    // Buscamos la receta por id
    $receta = $recetaObj->obtenerPorId($id_receta);

    // Si no existe la receta, devolvemos error
    if (!$receta) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha encontrado ninguna receta con ese id.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Obtenemos los ingredientes de esa receta
    $ingredientes = $recetaObj->obtenerIngredientes($id_receta);

    // Añadimos los ingredientes dentro del array de la receta
    $receta['ingredientes'] = $ingredientes;

    // Devolvemos la receta completa en JSON
    echo json_encode($receta, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    // Si algo falla, devolvemos el error en JSON
    echo json_encode([
        'error' => true,
        'mensaje' => $ex->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
