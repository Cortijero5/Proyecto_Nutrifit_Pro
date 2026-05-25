<?php
require_once __DIR__ . '/BaseDatos.php';

class Plan
{
    private $bd;

    public function __construct()
    {
        $this->bd = new BaseDatos();
    }

    public function listarTodos()
    {
        $sql = "SELECT 
                    id_plan,
                    nombre,
                    descripcion,
                    objetivo,
                    es_premium,
                    fecha_creacion,
                    id_creador
                FROM planes
                ORDER BY id_plan ASC";

        $resultado = $this->bd->ejecutaConsulta($sql);

        return $resultado->fetchAll();
    }

    public function obtenerPorId($id_plan)
    {
        $sql = "SELECT 
                    id_plan,
                    nombre,
                    descripcion,
                    objetivo,
                    es_premium,
                    fecha_creacion,
                    id_creador
                FROM planes
                WHERE id_plan = ?";

        $resultado = $this->bd->ejecutaConsulta($sql, [$id_plan]);

        return $resultado->fetch();
    }

    public function obtenerRecetas($id_plan)
    {
        $sql = "SELECT 
                r.id_receta,
                r.nombre,
                r.descripcion,
                r.tipo,
                r.nivel,
                r.imagen,
                pr.dia,
                pr.comida
            FROM plan_receta as pr, recetas as r
            WHERE pr.id_receta = r.id_receta
            AND pr.id_plan = ?
            ORDER BY 
                CASE pr.dia
                    WHEN 'lunes' THEN 1
                    WHEN 'martes' THEN 2
                    WHEN 'miércoles' THEN 3
                    WHEN 'jueves' THEN 4
                    WHEN 'viernes' THEN 5
                    WHEN 'sábado' THEN 6
                    WHEN 'domingo' THEN 7
                    ELSE 8
                END,
                CASE pr.comida
                    WHEN 'desayuno' THEN 1
                    WHEN 'comida' THEN 2
                    WHEN 'merienda' THEN 3
                    WHEN 'cena' THEN 4
                    ELSE 5
                END";

        $resultado = $this->bd->ejecutaConsulta($sql, [$id_plan]);

        return $resultado->fetchAll();
    }
}
