<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../clases/Receta.php';

try {
    if (!isset($_GET['tipo'])) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se ha indicado el tipo de receta.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $tipo = trim($_GET['tipo']);

    if ($tipo === '') {
        echo json_encode([
            'error' => true,
            'mensaje' => 'El tipo de receta no puede estar vacío.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $recetaObj = new Receta();

    $recetas = $recetaObj->listarPorTipo($tipo);

    if (count($recetas) === 0) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se han encontrado recetas de ese tipo.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    echo json_encode($recetas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Ha ocurrido un error al cargar las recetas por tipo.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
