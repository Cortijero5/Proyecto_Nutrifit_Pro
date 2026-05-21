<?php

// Indicamos que la respuesta será JSON
header('Content-Type: application/json; charset=utf-8');

// Importamos la clase Receta
require_once __DIR__ . '/../../clases/Receta.php';

// Recogemos el texto de búsqueda enviado por GET
$busqueda = trim($_GET['busqueda'] ?? '');

// Validamos que llegue algún texto
if ($busqueda === '') {
    echo json_encode([
        'error' => true,
        'mensaje' => 'No se ha indicado ningún término de búsqueda.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

// Evitamos búsquedas demasiado cortas
if (strlen($busqueda) < 2) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'La búsqueda debe tener al menos 2 caracteres.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}

try {
    // Creamos el objeto Receta
    $receta = new Receta();

    // Buscamos recetas por nombre, descripción o tipo
    $recetas = $receta->buscar($busqueda);

    // Si no hay resultados, devolvemos mensaje controlado
    if (count($recetas) === 0) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'No se han encontrado recetas para esa búsqueda.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Devolvemos las recetas encontradas
    echo json_encode($recetas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Error al buscar recetas.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
