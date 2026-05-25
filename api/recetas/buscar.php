<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../clases/Receta.php';

$busqueda = trim($_GET['busqueda'] ?? '');

if ($busqueda === '') {
    echo json_encode([
        'error' => true,
        'mensaje' => 'No se ha indicado ningún término de búsqueda.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

if (strlen($busqueda) < 2) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'La búsqueda debe tener al menos 2 caracteres.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

try {
    $receta = new Receta();

    $recetas = $receta->buscar($busqueda);

    if (count($recetas) === 0) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se han encontrado recetas para esa búsqueda.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    echo json_encode($recetas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Error al buscar recetas.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
