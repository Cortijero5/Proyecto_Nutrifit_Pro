<?php

// Importamos la clase BaseDatos para poder usar la conexión PDO
require_once __DIR__ . '/BaseDatos.php';

class Usuario
{
    // Guardamos una instancia de BaseDatos
    private $bd;

    public function __construct()
    {
        // Creamos el objeto BaseDatos para poder hacer consultas
        $this->bd = new BaseDatos();
    }

    public function buscarPorEmail($email)
    {
        // Consulta SQL para buscar un usuario por su email
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
        // Buscamos el usuario por email
        $usuario = $this->buscarPorEmail($email);

        // Si no existe ningún usuario con ese email, devolvemos false
        if (!$usuario) {
            return false;
        }

        // Comprobamos la contraseña escrita contra el hash guardado en la base de datos
        if (!password_verify($password, $usuario['password'])) {
            return false;
        }

        // Si llega aquí, email y contraseña son correctos
        return $usuario;
    }

    public function tieneSuscripcionActiva($id_usuario)
    {
        // Consulta SQL para comprobar si el usuario tiene una suscripción activa actualmente
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
