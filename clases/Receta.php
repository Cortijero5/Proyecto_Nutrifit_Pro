<?php
require_once __DIR__ . '/BaseDatos.php';

class Receta
{
    private $bd;

    public function __construct()
    {
        $this->bd = new BaseDatos();
    }

    public function listarTodas()
    {
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

        $resultado = $this->bd->ejecutaConsulta($sql, [$tipo]);

        return $resultado->fetchAll();
    }

    public function buscar($texto)
    {
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
                WHERE nombre LIKE ?
                   OR descripcion LIKE ?
                   OR tipo LIKE ?
                ORDER BY id_receta ASC";

        $busqueda = '%' . $texto . '%';

        $resultado = $this->bd->ejecutaConsulta($sql, [
            $busqueda,
            $busqueda,
            $busqueda
        ]);

        return $resultado->fetchAll();
    }

    public function obtenerPorId($id_receta)
    {
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
        $sql = "SELECT 
                    i.id_ingrediente,
                    i.nombre,
                    i.calorias_100g,
                    i.proteinas_100g,
                    i.hidratos_100g,
                    i.grasas_100g,
                    ri.cantidad,
                    ri.unidad
                FROM receta_ingrediente AS ri,
                     ingredientes AS i
                WHERE ri.id_ingrediente = i.id_ingrediente
                AND ri.id_receta = ?
                ORDER BY i.nombre ASC";

        $resultado = $this->bd->ejecutaConsulta($sql, [$id_receta]);

        return $resultado->fetchAll();
    }

    public function crear($nombre, $descripcion, $tipo, $nivel, $imagen, $id_creador)
    {
        $sql = "INSERT INTO recetas (
                    nombre,
                    descripcion,
                    tipo,
                    nivel,
                    fecha_creacion,
                    imagen,
                    id_creador
                ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    CURDATE(),
                    ?,
                    ?
                )";

        $this->bd->ejecutaConsulta($sql, [
            $nombre,
            $descripcion,
            $tipo,
            $nivel,
            $imagen,
            $id_creador
        ]);

        return $this->bd->getConexion()->lastInsertId();
    }

    public function actualizar($id_receta, $nombre, $descripcion, $tipo, $nivel, $imagen)
    {
        $sql = "UPDATE recetas
                SET nombre = ?,
                    descripcion = ?,
                    tipo = ?,
                    nivel = ?,
                    imagen = ?
                WHERE id_receta = ?";

        $resultado = $this->bd->ejecutaConsulta($sql, [
            $nombre,
            $descripcion,
            $tipo,
            $nivel,
            $imagen,
            $id_receta
        ]);

        return $resultado->rowCount();
    }

    public function eliminar($id_receta)
    {
        $conexion = $this->bd->getConexion();

        try {
            $conexion->beginTransaction();

            $sqlIngredientes = "DELETE FROM receta_ingrediente
                                WHERE id_receta = ?";

            $this->bd->ejecutaConsulta($sqlIngredientes, [$id_receta]);

            $sqlPlanes = "DELETE FROM plan_receta
                          WHERE id_receta = ?";

            $this->bd->ejecutaConsulta($sqlPlanes, [$id_receta]);

            $sqlReceta = "DELETE FROM recetas
                          WHERE id_receta = ?";

            $resultado = $this->bd->ejecutaConsulta($sqlReceta, [$id_receta]);

            $conexion->commit();

            return $resultado->rowCount();
        } catch (Exception $ex) {
            $conexion->rollBack();

            throw $ex;
        }
    }

    public function asociarIngrediente($id_receta, $id_ingrediente, $cantidad, $unidad)
    {
        $sql = "INSERT INTO receta_ingrediente (
                    id_receta,
                    id_ingrediente,
                    cantidad,
                    unidad
                ) VALUES (
                    ?,
                    ?,
                    ?,
                    ?
                )
                ON DUPLICATE KEY UPDATE
                    cantidad = VALUES(cantidad),
                    unidad = VALUES(unidad)";

        $this->bd->ejecutaConsulta($sql, [
            $id_receta,
            $id_ingrediente,
            $cantidad,
            $unidad
        ]);

        return true;
    }

    public function eliminarIngrediente($id_receta, $id_ingrediente)
    {
        $sql = "DELETE FROM receta_ingrediente
                WHERE id_receta = ?
                AND id_ingrediente = ?";

        $resultado = $this->bd->ejecutaConsulta($sql, [
            $id_receta,
            $id_ingrediente
        ]);

        return $resultado->rowCount();
    }
}
