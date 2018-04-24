<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/Expresion.php');
class Controlador_expresion extends Controlador_Base
{
   function crear($args)
   {
      $expresion = new Expresion($args["id"],$args["idRemitente"],$args["idBus"],$args["contenido"],$args["respuesta"],$args["idCalificacion"],$args["idAdjunto"]);
      $sql = "INSERT INTO Expresion (idRemitente,idBus,contenido,respuesta,idCalificacion,idAdjunto) VALUES (?,?,?,?,?,?);";
      $parametros = array($expresion->idRemitente,$expresion->idBus,$expresion->contenido,$expresion->respuesta,$expresion->idCalificacion,$expresion->idAdjunto);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $expresion = new Expresion($args["id"],$args["idRemitente"],$args["idBus"],$args["contenido"],$args["respuesta"],$args["idCalificacion"],$args["idAdjunto"]);
      $parametros = array($expresion->idRemitente,$expresion->idBus,$expresion->contenido,$expresion->respuesta,$expresion->idCalificacion,$expresion->idAdjunto,$expresion->id);
      $sql = "UPDATE Expresion SET idRemitente = ?,idBus = ?,contenido = ?,respuesta = ?,idCalificacion = ?,idAdjunto = ? WHERE id = ?;";
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
      $sql = "DELETE FROM Expresion WHERE id = ?;";
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
         $sql = "SELECT * FROM Expresion;";
      }else{
      $parametros = array($id);
         $sql = "SELECT * FROM Expresion WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT * FROM Expresion LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM Expresion;";
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
            $sql = "SELECT * FROM Expresion WHERE $nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT * FROM Expresion WHERE $nombreColumna LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT * FROM Expresion WHERE $nombreColumna LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT * FROM Expresion WHERE $nombreColumna LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}