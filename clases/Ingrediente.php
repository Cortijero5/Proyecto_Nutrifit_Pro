<?php
require_once __DIR__ . '/BaseDatos.php';

class Ingrediente
{
    private $bd;

    public function __construct()
    {
        $this->bd = new BaseDatos();
    }

    public function listarTodos()
    {
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
