<?php

// Importamos la clase BaseDatos para poder usar la conexión PDO
require_once __DIR__ . '/BaseDatos.php';

class Ingrediente
{
    // Guardamos una instancia de BaseDatos
    private $bd;

    public function __construct()
    {
        // Creamos el objeto BaseDatos para poder hacer consultas
        $this->bd = new BaseDatos();
    }

    public function listarTodos()
    {
        // Consulta SQL para obtener todos los ingredientes
        $sql = "SELECT 
                    id_ingrediente,
                    nombre,
                    calorias_100g,
                    proteinas_100g,
                    hidratos_100g,
                    grasas_100g
                FROM ingredientes
                ORDER BY nombre ASC";

        $resultado = $this->bd->ejecutaConsulta($sql);

        return $resultado->fetchAll();
    }

    public function obtenerPorId($id_ingrediente)
    {
        // Consulta SQL para obtener un ingrediente concreto por su id
        $sql = "SELECT 
                    id_ingrediente,
                    nombre,
                    calorias_100g,
                    proteinas_100g,
                    hidratos_100g,
                    grasas_100g
                FROM ingredientes
                WHERE id_ingrediente = ?";

        $resultado = $this->bd->ejecutaConsulta($sql, [$id_ingrediente]);

        return $resultado->fetch();
    }
}
