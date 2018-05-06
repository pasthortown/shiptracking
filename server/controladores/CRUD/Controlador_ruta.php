<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/Ruta.php');
class Controlador_ruta extends Controlador_Base
{
   function crear($args)
   {
      $ruta = new Ruta($args["id"],$args["desde"],$args["hasta"]);
      $sql = "INSERT INTO Ruta (desde,hasta) VALUES (?,?);";
      $parametros = array($ruta->desde,$ruta->hasta);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $ruta = new Ruta($args["id"],$args["desde"],$args["hasta"]);
      $parametros = array($ruta->desde,$ruta->hasta,$ruta->id);
      $sql = "UPDATE Ruta SET desde = ?,hasta = ? WHERE id = ?;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function borrar($args)
   {
      $id = $args["id"];
      $parametros = array($id);
      $sql = "DELETE FROM Ruta WHERE id = ?;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function leer($args)
   {
      $id = $args["id"];
      if ($id==""){
         $sql = "SELECT * FROM Ruta ORDER BY Ruta.id ASC;";
      }else{
      $parametros = array($id);
         $sql = "SELECT * FROM Ruta WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT * FROM Ruta ORDER BY Ruta.id ASC LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM Ruta;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta[0];
   }

   function leer_filtrado($args)
   {
      $nombreColumna = $args["columna"];
      $tipoFiltro = $args["tipo_filtro"];
      $filtro = $args["filtro"];
      switch ($tipoFiltro){
         case "coincide":
            $parametros = array($filtro);
            $sql = "SELECT * FROM Ruta WHERE $nombreColumna = ? ORDER BY Ruta.id ASC;";
            break;
         case "inicia":
            $sql = "SELECT * FROM Ruta WHERE $nombreColumna LIKE '$filtro%' ORDER BY Ruta.id ASC;";
            break;
         case "termina":
            $sql = "SELECT * FROM Ruta WHERE $nombreColumna LIKE '%$filtro' ORDER BY Ruta.id ASC;";
            break;
         default:
            $sql = "SELECT * FROM Ruta WHERE $nombreColumna LIKE '%$filtro%' ORDER BY Ruta.id ASC;";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}