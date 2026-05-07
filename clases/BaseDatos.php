<?php

class BaseDatos
{
    // Guarda la conexión PDO con la base de datos
    private  $conexion;

    public function __construct()
    {
        // Cargamos el archivo de configuración
        $config = parse_ini_file(__DIR__ . '/../config/config.ini');

        // Creamos el DSN, que indica a PDO cómo conectarse a MySQL
        $dsn = 'mysql:host=' . $config['server'] . ';dbname=' . $config['base'] . ';charset=utf8mb4';

        try {
            // Creamos la conexión con PDO
            $this->conexion = new PDO($dsn, $config['usu'], $config['pass']);

            // Activamos errores mediante excepciones
            $this->conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Indicamos que queremos resultados como arrays asociativos por defecto
            $this->conexion->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $ex) {
            // Si falla la conexión, detenemos el programa mostrando el error
            die('Error de conexión: ' . $ex->getMessage());
        }
    }

    public function getConexion()
    {
        // Devuelve la conexión para poder usarla desde otras clases
        return $this->conexion;
    }

    public function ejecutaConsulta($sql,  $parametros = [])
    {
        // Preparamos la consulta SQL
        $consulta = $this->conexion->prepare($sql);

        // Ejecutamos la consulta con los parámetros recibidos
        $consulta->execute($parametros);

        // Devolvemos el resultado
        return $consulta;
    }
}
