<?php

require_once __DIR__ . '/clases/Ingrediente.php';

$ingredienteObj = new Ingrediente();

$ingredientes = $ingredienteObj->listarTodos();

echo "<h1>Listado de ingredientes</h1>";

foreach ($ingredientes as $ingrediente) {
    echo "<article style='margin-bottom: 20px; padding: 10px; border: 1px solid #ccc;'>";

    echo "<h2>" . htmlspecialchars($ingrediente['nombre']) . "</h2>";
    echo "<p><strong>Calorías:</strong> " . htmlspecialchars($ingrediente['calorias_100g']) . " kcal / 100 g</p>";
    echo "<p><strong>Proteínas:</strong> " . htmlspecialchars($ingrediente['proteinas_100g']) . " g / 100 g</p>";
    echo "<p><strong>Hidratos:</strong> " . htmlspecialchars($ingrediente['hidratos_100g']) . " g / 100 g</p>";
    echo "<p><strong>Grasas:</strong> " . htmlspecialchars($ingrediente['grasas_100g']) . " g / 100 g</p>";

    echo "</article>";
}
