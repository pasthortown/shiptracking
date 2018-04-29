<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/Parada.php');
class Controlador_parada extends Controlador_Base
{
   function crear($args)
   {
      $parada = new Parada($args["id"],$args["idRuta"],$args["numero"],$args["nombre"],$args["latitud"],$args["longitud"],$args["tiempoEstimado"]);
      $sql = "INSERT INTO Parada (idRuta,numero,nombre,latitud,longitud,tiempoEstimado) VALUES (?,?,?,?,?,?);";
      $parametros = array($parada->idRuta,$parada->numero,$parada->nombre,$parada->latitud,$parada->longitud,$parada->tiempoEstimado);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $parada = new Parada($args["id"],$args["idRuta"],$args["numero"],$args["nombre"],$args["latitud"],$args["longitud"],$args["tiempoEstimado"]);
      $parametros = array($parada->idRuta,$parada->numero,$parada->nombre,$parada->latitud,$parada->longitud,$parada->tiempoEstimado,$parada->id);
      $sql = "UPDATE Parada SET idRuta = ?,numero = ?,nombre = ?,latitud = ?,longitud = ?,tiempoEstimado = ? WHERE id = ?;";
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
      $sql = "DELETE FROM Parada WHERE id = ?;";
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
         $sql = "SELECT * FROM Parada;";
      }else{
      $parametros = array($id);
         $sql = "SELECT * FROM Parada WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT * FROM Parada LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM Parada;";
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
            $sql = "SELECT * FROM Parada WHERE $nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT * FROM Parada WHERE $nombreColumna LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT * FROM Parada WHERE $nombreColumna LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT * FROM Parada WHERE $nombreColumna LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}