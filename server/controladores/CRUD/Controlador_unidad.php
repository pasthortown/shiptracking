<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/Unidad.php');
class Controlador_unidad extends Controlador_Base
{
   function crear($args)
   {
      $unidad = new Unidad($args["id"],$args["idCoperativa"],$args["idRuta"],$args["placa"],$args["numero"],$args["anoFabricacion"],$args["registroMunicipal"],$args["idTipoUnidad"]);
      $sql = "INSERT INTO Unidad (idCoperativa,idRuta,placa,numero,anoFabricacion,registroMunicipal,idTipoUnidad) VALUES (?,?,?,?,?,?,?);";
      $parametros = array($unidad->idCoperativa,$unidad->idRuta,$unidad->placa,$unidad->numero,$unidad->anoFabricacion,$unidad->registroMunicipal,$unidad->idTipoUnidad);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $unidad = new Unidad($args["id"],$args["idCoperativa"],$args["idRuta"],$args["placa"],$args["numero"],$args["anoFabricacion"],$args["registroMunicipal"],$args["idTipoUnidad"]);
      $parametros = array($unidad->idCoperativa,$unidad->idRuta,$unidad->placa,$unidad->numero,$unidad->anoFabricacion,$unidad->registroMunicipal,$unidad->idTipoUnidad,$unidad->id);
      $sql = "UPDATE Unidad SET idCoperativa = ?,idRuta = ?,placa = ?,numero = ?,anoFabricacion = ?,registroMunicipal = ?,idTipoUnidad = ? WHERE id = ?;";
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
      $sql = "DELETE FROM Unidad WHERE id = ?;";
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
         $sql = "SELECT Unidad.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', TipoUnidad.urlIcono as 'TipoUnidad' FROM Unidad INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa INNER JOIN Ruta ON Unidad.idRuta = Ruta.id INNER JOIN TipoUnidad ON TipoUnidad.id = Unidad.idTipoUnidad;";
      }else{
      $parametros = array($id);
         $sql = "SELECT Unidad.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', TipoUnidad.urlIcono as 'TipoUnidad' FROM Unidad INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa INNER JOIN Ruta ON Unidad.idRuta = Ruta.id INNER JOIN TipoUnidad ON TipoUnidad.id = Unidad.idTipoUnidad WHERE Unidad.id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT Unidad.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', TipoUnidad.urlIcono as 'TipoUnidad' FROM Unidad INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa INNER JOIN Ruta ON Unidad.idRuta = Ruta.id INNER JOIN TipoUnidad ON TipoUnidad.id = Unidad.idTipoUnidad LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM Unidad INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa INNER JOIN Ruta ON Unidad.idRuta = Ruta.id INNER JOIN TipoUnidad ON TipoUnidad.id = Unidad.idTipoUnidad;";
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
            $sql = "SELECT Unidad.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', TipoUnidad.urlIcono as 'TipoUnidad' FROM Unidad INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa INNER JOIN Ruta ON Unidad.idRuta = Ruta.id INNER JOIN TipoUnidad ON TipoUnidad.id = Unidad.idTipoUnidad WHERE Unidad.$nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT Unidad.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', TipoUnidad.urlIcono as 'TipoUnidad' FROM Unidad INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa INNER JOIN Ruta ON Unidad.idRuta = Ruta.id INNER JOIN TipoUnidad ON TipoUnidad.id = Unidad.idTipoUnidad WHERE Unidad.$nombreColumna LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT Unidad.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', TipoUnidad.urlIcono as 'TipoUnidad' FROM Unidad INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa INNER JOIN Ruta ON Unidad.idRuta = Ruta.id INNER JOIN TipoUnidad ON TipoUnidad.id = Unidad.idTipoUnidad WHERE Unidad.$nombreColumna LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT Unidad.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde, ' - ', Ruta.hasta) as 'Ruta', TipoUnidad.urlIcono as 'TipoUnidad' FROM Unidad INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa INNER JOIN Ruta ON Unidad.idRuta = Ruta.id INNER JOIN TipoUnidad ON TipoUnidad.id = Unidad.idTipoUnidad WHERE Unidad.$nombreColumna LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}