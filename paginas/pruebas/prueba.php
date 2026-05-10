<?php

require_once __DIR__ . '/clases/BaseDatos.php';

$bd = new BaseDatos();

$resultado = $bd->ejecutaConsulta("SELECT COUNT(*) AS total FROM usuarios");

$fila = $resultado->fetch();

echo "Conexión correcta.<br>";
echo "Total de usuarios en la base de datos: " . $fila['total'];
