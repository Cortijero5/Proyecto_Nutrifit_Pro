<?php

require_once __DIR__ . '/clases/Receta.php';

$recetaObj = new Receta();

// Probamos con la receta 1: Pollo con arroz fit
$receta = $recetaObj->obtenerPorId(1);
$ingredientes = $recetaObj->obtenerIngredientes(1);

echo "<h1>Detalle de receta</h1>";

if ($receta) {
    echo "<h2>" . htmlspecialchars($receta['nombre']) . "</h2>";
    echo "<p><strong>Descripción:</strong> " . htmlspecialchars($receta['descripcion']) . "</p>";
    echo "<p><strong>Tipo:</strong> " . htmlspecialchars($receta['tipo']) . "</p>";
    echo "<p><strong>Nivel:</strong> " . htmlspecialchars($receta['nivel']) . "</p>";
    echo "<p><strong>Imagen:</strong> " . htmlspecialchars($receta['imagen']) . "</p>";

    echo "<h3>Ingredientes</h3>";
    echo "<ul>";

    foreach ($ingredientes as $ingrediente) {
        echo "<li>";
        echo htmlspecialchars($ingrediente['cantidad']) . " ";
        echo htmlspecialchars($ingrediente['unidad']) . " de ";
        echo htmlspecialchars($ingrediente['nombre']);
        echo "</li>";
    }

    echo "</ul>";
} else {
    echo "<p>No se ha encontrado la receta.</p>";
}
