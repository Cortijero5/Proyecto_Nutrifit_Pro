<?php
require_once __DIR__ . '/BaseDatos.php';

class Usuario
{
    private $bd;

    public function __construct()
    {
        $this->bd = new BaseDatos();
    }

    public function buscarPorEmail($email)
    {
        $sql = "SELECT 
                    id_usuario,
                    nombre,
                    apellidos,
                    email,
                    password,
                    rol,
                    id_gimnasio
                FROM usuarios
                WHERE email = ?";

        $resultado = $this->bd->ejecutaConsulta($sql, [$email]);

        return $resultado->fetch();
    }

    public function validarLogin($email, $password)
    {
        $usuario = $this->buscarPorEmail($email);

        if (!$usuario) {
            return false;
        }

        if (!password_verify($password, $usuario['password'])) {
            return false;
        }

        return $usuario;
    }

    public function tieneSuscripcionActiva($id_usuario)
    {
        $sql = "SELECT 
                    id_suscripcion,
                    id_usuario,
                    fecha_inicio,
                    fecha_fin,
                    estado
                FROM suscripciones
                WHERE id_usuario = ?
                AND estado = 'activa'
                AND fecha_inicio <= CURDATE()
                AND fecha_fin >= CURDATE()";

        $resultado = $this->bd->ejecutaConsulta($sql, [$id_usuario]);

        $suscripcion = $resultado->fetch();

        if ($suscripcion) {
            return true;
        } else {
            return false;
        }
    }
}
