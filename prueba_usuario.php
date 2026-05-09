<?php

require_once __DIR__ . '/clases/Usuario.php';

$usuarioObj = new Usuario();

// Cambia estos datos para probar diferentes usuarios
$email = 'admin@nutrifit.es';
$password = 'admin123';

$usuario = $usuarioObj->validarLogin($email, $password);

echo "<h1>Prueba de usuario</h1>";

if ($usuario) {
    echo "<p>Login correcto.</p>";
    echo "<p><strong>Nombre:</strong> " . htmlspecialchars($usuario['nombre']) . "</p>";
    echo "<p><strong>Email:</strong> " . htmlspecialchars($usuario['email']) . "</p>";
    echo "<p><strong>Rol:</strong> " . htmlspecialchars($usuario['rol']) . "</p>";

    $esPremium = $usuarioObj->tieneSuscripcionActiva($usuario['id_usuario']);

    if ($esPremium) {
        echo "<p><strong>Premium:</strong> Sí</p>";
    } else {
        echo "<p><strong>Premium:</strong> No</p>";
    }
} else {
    echo "<p>Login incorrecto.</p>";
}
