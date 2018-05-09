<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/AsignacionRuta.php');
class Controlador_asignacionruta extends Controlador_Base
{
   function crear($args)
   {
      $asignacionruta = new AsignacionRuta($args["id"],$args["idRuta"],$args["idUnidad"],$args["diaSemana"]);
      $sql = "INSERT INTO AsignacionRuta (idRuta,idUnidad,diaSemana) VALUES (?,?,?);";
      $parametros = array($asignacionruta->idRuta,$asignacionruta->idUnidad,$asignacionruta->diaSemana);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $asignacionruta = new AsignacionRuta($args["id"],$args["idRuta"],$args["idUnidad"],$args["diaSemana"]);
      $parametros = array($asignacionruta->idRuta,$asignacionruta->idUnidad,$asignacionruta->diaSemana,$asignacionruta->id);
      $sql = "UPDATE AsignacionRuta SET idRuta = ?,idUnidad = ?,diaSemana = ? WHERE id = ?;";
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
      $sql = "DELETE FROM AsignacionRuta WHERE id = ?;";
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
         $sql = "SELECT AsignacionRuta.*, CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', CONCAT(Coperativa.nombre,' - ', Unidad.numero) as 'Unidad' FROM AsignacionRuta INNER JOIN Ruta ON AsignacionRuta.idRuta = Ruta.id INNER JOIN Unidad ON Unidad.id = AsignacionRuta.idUnidad INNER JOIN Coperativa ON Unidad.idCoperativa = Coperativa.id ORDER BY Unidad.idCoperativa, Unidad.numero, AsignacionRuta.diaSemana ASC;";
      }else{
      $parametros = array($id);
         $sql = "SELECT AsignacionRuta.*, CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', CONCAT(Coperativa.nombre,' - ', Unidad.numero) as 'Unidad' FROM AsignacionRuta INNER JOIN Ruta ON AsignacionRuta.idRuta = Ruta.id INNER JOIN Unidad ON Unidad.id = AsignacionRuta.idUnidad INNER JOIN Coperativa ON Unidad.idCoperativa = Coperativa.id WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT AsignacionRuta.*, CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', CONCAT(Coperativa.nombre,' - ', Unidad.numero) as 'Unidad' FROM AsignacionRuta INNER JOIN Ruta ON AsignacionRuta.idRuta = Ruta.id INNER JOIN Unidad ON Unidad.id = AsignacionRuta.idUnidad INNER JOIN Coperativa ON Unidad.idCoperativa = Coperativa.id ORDER BY Unidad.idCoperativa, Unidad.numero, AsignacionRuta.diaSemana ASC LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM AsignacionRuta;";
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
            $sql = "SELECT AsignacionRuta.*, CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', CONCAT(Coperativa.nombre,' - ', Unidad.numero) as 'Unidad' FROM AsignacionRuta INNER JOIN Ruta ON AsignacionRuta.idRuta = Ruta.id INNER JOIN Unidad ON Unidad.id = AsignacionRuta.idUnidad INNER JOIN Coperativa ON Unidad.idCoperativa = Coperativa.id ORDER BY Unidad.idCoperativa, Unidad.numero, AsignacionRuta.diaSemana ASC WHERE $nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT AsignacionRuta.*, CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', CONCAT(Coperativa.nombre,' - ', Unidad.numero) as 'Unidad' FROM AsignacionRuta INNER JOIN Ruta ON AsignacionRuta.idRuta = Ruta.id INNER JOIN Unidad ON Unidad.id = AsignacionRuta.idUnidad INNER JOIN Coperativa ON Unidad.idCoperativa = Coperativa.id ORDER BY Unidad.idCoperativa, Unidad.numero, AsignacionRuta.diaSemana ASC LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT AsignacionRuta.*, CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', CONCAT(Coperativa.nombre,' - ', Unidad.numero) as 'Unidad' FROM AsignacionRuta INNER JOIN Ruta ON AsignacionRuta.idRuta = Ruta.id INNER JOIN Unidad ON Unidad.id = AsignacionRuta.idUnidad INNER JOIN Coperativa ON Unidad.idCoperativa = Coperativa.id ORDER BY Unidad.idCoperativa, Unidad.numero, AsignacionRuta.diaSemana ASC LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT AsignacionRuta.*, CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', CONCAT(Coperativa.nombre,' - ', Unidad.numero) as 'Unidad' FROM AsignacionRuta INNER JOIN Ruta ON AsignacionRuta.idRuta = Ruta.id INNER JOIN Unidad ON Unidad.id = AsignacionRuta.idUnidad INNER JOIN Coperativa ON Unidad.idCoperativa = Coperativa.id ORDER BY Unidad.idCoperativa, Unidad.numero, AsignacionRuta.diaSemana ASC LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}