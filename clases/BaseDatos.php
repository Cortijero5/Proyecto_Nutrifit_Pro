<?php

class BaseDatos
{
    private $conexion;

    public function __construct()
    {
        $config = parse_ini_file(__DIR__ . '/../config/config.ini');

        $dsn = 'mysql:host=' . $config['server'] . ';dbname=' . $config['base'] . ';charset=utf8mb4';

        try {
            $this->conexion = new PDO($dsn, $config['usu'], $config['pass']);
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $ex) {
            die('Error de conexión con la base de datos.');
        }
    }

    public function getConexion()
    {
        return $this->conexion;
    }

    public function ejecutaConsulta($sql, $parametros = [])
    {
        $consulta = $this->conexion->prepare($sql);
        $consulta->execute($parametros);

        return $consulta;
    }
}
