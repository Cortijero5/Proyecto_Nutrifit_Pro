<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../clases/Receta.php';

try {
    if (!isset($_GET['id'])) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha indicado el id de la receta.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $id_receta = $_GET['id'];

    if (!is_numeric($id_receta)) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'El id de la receta no es válido.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $recetaObj = new Receta();

    $receta = $recetaObj->obtenerPorId($id_receta);

    if (!$receta) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha encontrado ninguna receta con ese id.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $ingredientes = $recetaObj->obtenerIngredientes($id_receta);

    $receta['ingredientes'] = $ingredientes;

    echo json_encode($receta, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Ha ocurrido un error al cargar el detalle de la receta.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
