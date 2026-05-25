<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../clases/Plan.php';

try {
    if (!isset($_GET['id'])) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha indicado el id del plan.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $id_plan = trim($_GET['id']);

    if ($id_plan === '' || !is_numeric($id_plan)) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'El id del plan no es válido.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $planObj = new Plan();

    $plan = $planObj->obtenerPorId($id_plan);

    if (!$plan) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha encontrado ningún plan con ese id.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $recetas = $planObj->obtenerRecetas($id_plan);

    $plan['recetas'] = $recetas;

    echo json_encode($plan, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Ha ocurrido un error al cargar el detalle del plan.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
