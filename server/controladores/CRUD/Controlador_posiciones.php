<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/Posiciones.php');
class Controlador_posiciones extends Controlador_Base
{
   function cargar($argsurl)
   {
      $datos = $argsurl["datos"];
      foreach($datos as $args){
            $posiciones = new Posiciones($args["id"],$args["idUnidad"],$args["tiempo"],$args["latitud"],$args["longitud"],$args["velocidad"]);
            $sql = "INSERT INTO Posiciones (idUnidad,tiempo,latitud,longitud,velocidad) VALUES (?,?,?,?,?);";
            $tiempoNoSQLTime = strtotime($posiciones->tiempo);
            $tiempoSQLTime = date("Y-m-d H:i:s", $tiempoNoSQLTime);
            $posiciones->tiempo = $tiempoSQLTime;
            $parametros = array($posiciones->idUnidad,$posiciones->tiempo,$posiciones->latitud,$posiciones->longitud,$posiciones->velocidad);
            $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      }
      return true;
   }

   function crear($args)
   {
      $posiciones = new Posiciones($args["id"],$args["idUnidad"],$args["tiempo"],$args["latitud"],$args["longitud"],$args["velocidad"]);
      $sql = "INSERT INTO Posiciones (idUnidad,tiempo,latitud,longitud,velocidad) VALUES (?,?,?,?,?);";
      $tiempoNoSQLTime = strtotime($posiciones->tiempo);
      $tiempoSQLTime = date("Y-m-d H:i:s", $tiempoNoSQLTime);
      $posiciones->tiempo = $tiempoSQLTime;
      $parametros = array($posiciones->idUnidad,$posiciones->tiempo,$posiciones->latitud,$posiciones->longitud,$posiciones->velocidad);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $posiciones = new Posiciones($args["id"],$args["idUnidad"],$args["tiempo"],$args["latitud"],$args["longitud"],$args["velocidad"]);
      $parametros = array($posiciones->idUnidad,$posiciones->tiempo,$posiciones->latitud,$posiciones->longitud,$posiciones->velocidad,$posiciones->id);
      $sql = "UPDATE Posiciones SET idUnidad = ?,tiempo = ?,latitud = ?,longitud = ?,velocidad = ? WHERE id = ?;";
      $tiempoNoSQLTime = strtotime($posiciones->tiempo);
      $tiempoSQLTime = date("Y-m-d H:i:s", $tiempoNoSQLTime);
      $posiciones->tiempo = $tiempoSQLTime;
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
      $sql = "DELETE FROM Posiciones WHERE id = ?;";
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
         $sql = "SELECT * FROM Posiciones;";
      }else{
      $parametros = array($id);
         $sql = "SELECT * FROM Posiciones WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT * FROM Posiciones LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM Posiciones;";
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
            $sql = "SELECT * FROM Posiciones WHERE $nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT * FROM Posiciones WHERE $nombreColumna LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT * FROM Posiciones WHERE $nombreColumna LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT * FROM Posiciones WHERE $nombreColumna LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function getMonitoreoUnidad($args)
   {
      $idCoperativa = $args["idCoperativa"];
      $idUnidad = $args["idUnidad"];
      $fecha = $args["fecha"];
      $tiempoNoSQLTime = strtotime($fecha);
      $tiempoSQLTime = date("Y-m-d", $tiempoNoSQLTime);
      $parametros = array($idCoperativa, $idUnidad, $tiempoSQLTime);
      $sql = "SELECT Unidad.id as 'idUnidad', TipoUnidad.urlIcono, Unidad.numero, Unidad.placa, Unidad.registroMunicipal, Posiciones.latitud, Posiciones.longitud, Posiciones.tiempo, Posiciones.velocidad FROM Posiciones INNER JOIN Unidad ON Posiciones.idUnidad = Unidad.id INNER JOIN TipoUnidad ON Unidad.idTipoUnidad = TipoUnidad.id INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa WHERE idCoperativa = ?  AND idUnidad = ? AND DATE(Posiciones.tiempo)=? ORDER BY Posiciones.tiempo DESC;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function getMonitoreoUnidadActual($args)
   {
      $idCoperativa = $args["idCoperativa"];
      $idUnidad = $args["idUnidad"];
      $parametros = array($idCoperativa, $idUnidad);
      $sql = "SELECT Unidad.id as 'idUnidad', TipoUnidad.urlIcono, Unidad.numero, Unidad.placa, Unidad.registroMunicipal, Posiciones.latitud, Posiciones.longitud, Posiciones.tiempo, Posiciones.velocidad FROM Posiciones INNER JOIN Unidad ON Posiciones.idUnidad = Unidad.id INNER JOIN TipoUnidad ON Unidad.idTipoUnidad = TipoUnidad.id INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa WHERE idCoperativa = ?  AND idUnidad = ? ORDER BY Posiciones.tiempo DESC LIMIT 1;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}