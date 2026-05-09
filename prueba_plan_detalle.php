<?php

require_once __DIR__ . '/clases/Plan.php';

$planObj = new Plan();

// Probamos con el plan 1: Ganancia muscular
$plan = $planObj->obtenerPorId(1);
$recetas = $planObj->obtenerRecetas(1);

echo "<h1>Detalle de plan</h1>";

if ($plan) {
    echo "<h2>" . htmlspecialchars($plan['nombre']) . "</h2>";
    echo "<p><strong>Descripción:</strong> " . htmlspecialchars($plan['descripcion']) . "</p>";
    echo "<p><strong>Objetivo:</strong> " . htmlspecialchars($plan['objetivo']) . "</p>";
    echo "<p><strong>Premium:</strong> " . htmlspecialchars($plan['es_premium']) . "</p>";

    echo "<h3>Recetas del plan</h3>";

    if (count($recetas) > 0) {
        echo "<ul>";

        foreach ($recetas as $receta) {
            echo "<li>";
            echo "<strong>" . htmlspecialchars($receta['dia']) . " - " . htmlspecialchars($receta['comida']) . ":</strong> ";
            echo htmlspecialchars($receta['nombre']);
            echo " (" . htmlspecialchars($receta['tipo']) . ")";
            echo "</li>";
        }

        echo "</ul>";
    } else {
        echo "<p>Este plan no tiene recetas asociadas.</p>";
    }
} else {
    echo "<p>No se ha encontrado el plan.</p>";
}
