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

    public function buscar($texto)
    {
        // Consulta SQL para buscar recetas por nombre, descripción o tipo
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

        // Añadimos comodines para buscar el texto en cualquier parte del campo
        $busqueda = '%' . $texto . '%';

        // Usamos parámetros para evitar inyección SQL
        $resultado = $this->bd->ejecutaConsulta($sql, [
            $busqueda,
            $busqueda,
            $busqueda
        ]);

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
        // Consulta SQL para obtener los ingredientes de una receta concreta
        $sql = "SELECT 
                    i.id_ingrediente,
                    i.nombre,
                    i.calorias_100g,
                    i.proteinas_100g,
                    i.hidratos_100g,
                    i.grasas_100g,
                    ri.cantidad,
                    ri.unidad
                FROM receta_ingrediente AS ri
                INNER JOIN ingredientes AS i
                    ON ri.id_ingrediente = i.id_ingrediente
                WHERE ri.id_receta = ?
                ORDER BY i.nombre ASC";

        $resultado = $this->bd->ejecutaConsulta($sql, [$id_receta]);

        return $resultado->fetchAll();
    }

    public function crear($nombre, $descripcion, $tipo, $nivel, $imagen, $id_creador)
    {
        // Consulta SQL para insertar una nueva receta en la base de datos
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

        // Ejecutamos la consulta usando parámetros para evitar inyección SQL
        $this->bd->ejecutaConsulta($sql, [
            $nombre,
            $descripcion,
            $tipo,
            $nivel,
            $imagen,
            $id_creador
        ]);

        // Devolvemos el id de la última receta insertada
        return $this->bd->getConexion()->lastInsertId();
    }

    public function actualizar($id_receta, $nombre, $descripcion, $tipo, $nivel, $imagen)
    {
        // Consulta SQL para actualizar una receta existente
        $sql = "UPDATE recetas
                SET nombre = ?,
                    descripcion = ?,
                    tipo = ?,
                    nivel = ?,
                    imagen = ?
                WHERE id_receta = ?";

        // Ejecutamos la consulta con parámetros para evitar inyección SQL
        $resultado = $this->bd->ejecutaConsulta($sql, [
            $nombre,
            $descripcion,
            $tipo,
            $nivel,
            $imagen,
            $id_receta
        ]);

        // Devolvemos cuántas filas se han modificado
        return $resultado->rowCount();
    }

    public function eliminar($id_receta)
    {
        // Obtenemos la conexión PDO para poder usar transacciones
        $conexion = $this->bd->getConexion();

        try {
            // Iniciamos una transacción para que todo se haga junto
            $conexion->beginTransaction();

            // Primero eliminamos las relaciones con ingredientes
            $sqlIngredientes = "DELETE FROM receta_ingrediente
                                WHERE id_receta = ?";

            $this->bd->ejecutaConsulta($sqlIngredientes, [$id_receta]);

            // Después eliminamos las relaciones con planes
            $sqlPlanes = "DELETE FROM plan_receta
                          WHERE id_receta = ?";

            $this->bd->ejecutaConsulta($sqlPlanes, [$id_receta]);

            // Por último eliminamos la receta principal
            $sqlReceta = "DELETE FROM recetas
                          WHERE id_receta = ?";

            $resultado = $this->bd->ejecutaConsulta($sqlReceta, [$id_receta]);

            // Confirmamos la transacción
            $conexion->commit();

            // Devolvemos cuántas recetas se han eliminado
            return $resultado->rowCount();
        } catch (Exception $ex) {
            // Si algo falla, deshacemos todos los cambios
            $conexion->rollBack();

            // Lanzamos de nuevo el error para que lo gestione el endpoint
            throw $ex;
        }
    }

    public function asociarIngrediente($id_receta, $id_ingrediente, $cantidad, $unidad)
    {
        // Inserta o actualiza la relación entre receta e ingrediente.
        // Si ese ingrediente ya estaba en la receta, actualizamos cantidad y unidad.
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
        // Elimina un ingrediente asociado a una receta
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
