<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/Coperativa.php');
class Controlador_coperativa extends Controlador_Base
{
   function crear($args)
   {
      $coperativa = new Coperativa($args["id"],$args["RUC"],$args["nombre"],$args["direccion"],$args["telefono1"],$args["telefono2"]);
      $sql = "INSERT INTO Coperativa (RUC,nombre,direccion,telefono1,telefono2) VALUES (?,?,?,?,?);";
      $parametros = array($coperativa->RUC,$coperativa->nombre,$coperativa->direccion,$coperativa->telefono1,$coperativa->telefono2);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $coperativa = new Coperativa($args["id"],$args["RUC"],$args["nombre"],$args["direccion"],$args["telefono1"],$args["telefono2"]);
      $parametros = array($coperativa->RUC,$coperativa->nombre,$coperativa->direccion,$coperativa->telefono1,$coperativa->telefono2,$coperativa->id);
      $sql = "UPDATE Coperativa SET RUC = ?,nombre = ?,direccion = ?,telefono1 = ?,telefono2 = ? WHERE id = ?;";
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
      $sql = "DELETE FROM Coperativa WHERE id = ?;";
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
         $sql = "SELECT * FROM Coperativa;";
      }else{
      $parametros = array($id);
         $sql = "SELECT * FROM Coperativa WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT * FROM Coperativa LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM Coperativa;";
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
            $sql = "SELECT * FROM Coperativa WHERE $nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT * FROM Coperativa WHERE $nombreColumna LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT * FROM Coperativa WHERE $nombreColumna LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT * FROM Coperativa WHERE $nombreColumna LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}