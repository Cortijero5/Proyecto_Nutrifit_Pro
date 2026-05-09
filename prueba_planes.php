<?php

require_once __DIR__ . '/clases/Plan.php';

$planObj = new Plan();

$planes = $planObj->listarTodos();

echo "<h1>Listado de planes</h1>";

foreach ($planes as $plan) {
    echo "<article style='margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;'>";

    echo "<h2>" . htmlspecialchars($plan['nombre']) . "</h2>";
    echo "<p><strong>Descripción:</strong> " . htmlspecialchars($plan['descripcion']) . "</p>";
    echo "<p><strong>Objetivo:</strong> " . htmlspecialchars($plan['objetivo']) . "</p>";
    echo "<p><strong>Premium:</strong> " . htmlspecialchars($plan['es_premium']) . "</p>";

    echo "</article>";
}
