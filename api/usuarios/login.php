<?php

// Iniciamos la sesión para poder guardar datos del usuario logueado
session_start();

// Indicamos que este archivo devuelve JSON
header('Content-Type: application/json; charset=utf-8');

// Importamos la clase Usuario
require_once __DIR__ . '/../../clases/Usuario.php';

try {
    // Comprobamos si llegan los datos necesarios por POST
    if (!isset($_POST['email']) || !isset($_POST['password'])) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'Faltan datos para iniciar sesión.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Recogemos los datos enviados desde el formulario o desde AJAX
    // Al email le hacemos trim para quitar espacios accidentales al principio o al final
    $email = trim($_POST['email']);

    // La contraseña no se limpia con trim porque una contraseña podría contener espacios
    $password = $_POST['password'];

    // Validamos que no estén vacíos
    if ($email === '' || $password === '') {
        echo json_encode([
            'error' => true,
            'mensaje' => 'Email y contraseña son obligatorios.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Creamos el objeto Usuario
    $usuarioObj = new Usuario();

    // Validamos email y contraseña.
    // La comparación real se hace dentro de Usuario.php con password_verify().
    $usuario = $usuarioObj->validarLogin($email, $password);

    // Si el login es incorrecto, devolvemos error
    if (!$usuario) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'Email o contraseña incorrectos.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    // Comprobamos si el usuario tiene suscripción activa
    $esPremium = $usuarioObj->tieneSuscripcionActiva($usuario['id_usuario']);

    // Guardamos datos importantes en la sesión
    $_SESSION['id_usuario'] = $usuario['id_usuario'];
    $_SESSION['nombre'] = $usuario['nombre'];
    $_SESSION['email'] = $usuario['email'];
    $_SESSION['rol'] = $usuario['rol'];
    $_SESSION['premium'] = $esPremium;

    // Devolvemos respuesta correcta en JSON
    echo json_encode([
        'error' => false,
        'mensaje' => 'Login correcto.',
        'usuario' => [
            'id_usuario' => $usuario['id_usuario'],
            'nombre' => $usuario['nombre'],
            'apellidos' => $usuario['apellidos'],
            'email' => $usuario['email'],
            'rol' => $usuario['rol'],
            'premium' => $esPremium
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
} catch (Exception $ex) {
    echo json_encode([
        'error' => true,
        'mensaje' => 'Ha ocurrido un error al iniciar sesión.'
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
