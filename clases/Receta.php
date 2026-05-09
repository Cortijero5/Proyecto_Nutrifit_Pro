<?php

// Importamos la clase BaseDatos para poder usar la conexión PDO
require_once __DIR__ . '/BaseDatos.php';

class Receta
{
    // Guardamos una instancia de BaseDatos
    private $bd;

    public function __construct()
    {
        // Creamos el objeto BaseDatos para poder hacer consultas
        $this->bd = new BaseDatos();
    }

    public function listarTodas()
    {
        // Consulta SQL para obtener todas las recetas
        $sql = "SELECT 
                    id_receta,
                    nombre,
                    descripcion,
                    tipo,
                    nivel,
                    fecha_creacion,
                    imagen,
                    id_creador
                FROM recetas
                ORDER BY id_receta ASC";

        $resultado = $this->bd->ejecutaConsulta($sql);

        return $resultado->fetchAll();
    }

    public function listarPorTipo($tipo)
    {
        // Consulta SQL para obtener recetas filtradas por tipo
        $sql = "SELECT 
                    id_receta,
                    nombre,
                    descripcion,
                    tipo,
                    nivel,
                    fecha_creacion,
                    imagen,
                    id_creador
                FROM recetas
                WHERE tipo = ?
                ORDER BY id_receta ASC";

        // El valor de $tipo se pasa como parámetro para evitar inyección SQL
        $resultado = $this->bd->ejecutaConsulta($sql, [$tipo]);

        return $resultado->fetchAll();
    }

    public function obtenerPorId($id_receta)
    {
        // Consulta SQL para obtener una receta concreta por su id
        $sql = "SELECT 
                    id_receta,
                    nombre,
                    descripcion,
                    tipo,
                    nivel,
                    fecha_creacion,
                    imagen,
                    id_creador
                FROM recetas
                WHERE id_receta = ?";

        $resultado = $this->bd->ejecutaConsulta($sql, [$id_receta]);

        return $resultado->fetch();
    }

    public function obtenerIngredientes($id_receta)
    {
        // Consulta SQL para obtener los ingredientes de una receta concreta.
        // Usamos dos tablas en el FROM y relacionamos sus claves en el WHERE.
        $sql = "SELECT 
                i.id_ingrediente,
                i.nombre,
                i.calorias_100g,
                i.proteinas_100g,
                i.hidratos_100g,
                i.grasas_100g,
                ri.cantidad,
                ri.unidad
            FROM receta_ingrediente as ri, ingredientes as i
            WHERE ri.id_ingrediente = i.id_ingrediente
            AND ri.id_receta = ?
            ORDER BY i.nombre ASC";

        $resultado = $this->bd->ejecutaConsulta($sql, [$id_receta]);

        return $resultado->fetchAll();
    }
}
