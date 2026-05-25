<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../clases/Usuario.php';

try {
    if (!isset($_POST['email']) || !isset($_POST['password'])) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'Faltan datos para iniciar sesión.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $email = trim($_POST['email']);
    $password = $_POST['password'];

    if ($email === '' || $password === '') {
        echo json_encode([
            'error' => true,
            'mensaje' => 'Email y contraseña son obligatorios.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $usuarioObj = new Usuario();
    $usuario = $usuarioObj->validarLogin($email, $password);

    if (!$usuario) {
        echo json_encode([
            'error' => true,
            'mensaje' => 'Email o contraseña incorrectos.'
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        exit;
    }

    $esPremium = $usuarioObj->tieneSuscripcionActiva($usuario['id_usuario']);

    $_SESSION['id_usuario'] = $usuario['id_usuario'];
    $_SESSION['nombre'] = $usuario['nombre'];
    $_SESSION['email'] = $usuario['email'];
    $_SESSION['rol'] = $usuario['rol'];
    $_SESSION['premium'] = $esPremium;

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
