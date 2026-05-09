<?php

// Indicamos que este archivo devuelve JSON
header('Content-Type: application/json; charset=utf-8');

// Importamos la clase Plan
require_once __DIR__ . '/../../clases/Plan.php';

try {
    // Comprobamos si nos han pasado el id por la URL
    if (!isset($_GET['id'])) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha indicado el id del plan.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Guardamos el id recibido por GET
    $id_plan = $_GET['id'];

    // Creamos el objeto Plan
    $planObj = new Plan();

    // Buscamos el plan por id
    $plan = $planObj->obtenerPorId($id_plan);

    // Si no existe el plan, devolvemos un error controlado
    if (!$plan) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha encontrado ningún plan con ese id.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Obtenemos las recetas asociadas al plan
    $recetas = $planObj->obtenerRecetas($id_plan);

    // Añadimos las recetas dentro del array del plan
    $plan['recetas'] = $recetas;

    // Devolvemos el plan completo en JSON
    echo json_encode($plan, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    // Si ocurre algún error, devolvemos una respuesta JSON con el mensaje
    echo json_encode([
        'error' => true,
        'mensaje' => $ex->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
