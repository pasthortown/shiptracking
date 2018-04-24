<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/Bus.php');
class Controlador_bus extends Controlador_Base
{
   function crear($args)
   {
      $bus = new Bus($args["id"],$args["idCoperativa"],$args["idRuta"],$args["placa"],$args["numero"],$args["anoFabricacion"],$args["registroMunicipal"]);
      $sql = "INSERT INTO Bus (idCoperativa,idRuta,placa,numero,anoFabricacion,registroMunicipal) VALUES (?,?,?,?,?,?);";
      $parametros = array($bus->idCoperativa,$bus->idRuta,$bus->placa,$bus->numero,$bus->anoFabricacion,$bus->registroMunicipal);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $bus = new Bus($args["id"],$args["idCoperativa"],$args["idRuta"],$args["placa"],$args["numero"],$args["anoFabricacion"],$args["registroMunicipal"]);
      $parametros = array($bus->idCoperativa,$bus->idRuta,$bus->placa,$bus->numero,$bus->anoFabricacion,$bus->registroMunicipal,$bus->id);
      $sql = "UPDATE Bus SET idCoperativa = ?,idRuta = ?,placa = ?,numero = ?,anoFabricacion = ?,registroMunicipal = ? WHERE id = ?;";
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
      $sql = "DELETE FROM Bus WHERE id = ?;";
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
         $sql = "SELECT Bus.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde,' - ',Ruta.hasta) as 'Ruta' FROM Bus INNER JOIN Coperativa ON Bus.idCoperativa = Coperativa.id INNER JOIN Ruta ON Bus.idRuta = Ruta.id;";
      }else{
      $parametros = array($id);
         $sql = "SELECT Bus.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde,' - ',Ruta.hasta) as 'Ruta' FROM Bus INNER JOIN Coperativa ON Bus.idCoperativa = Coperativa.id INNER JOIN Ruta ON Bus.idRuta = Ruta.id WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT Bus.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde,' - ',Ruta.hasta) as 'Ruta' FROM Bus INNER JOIN Coperativa ON Bus.idCoperativa = Coperativa.id INNER JOIN Ruta ON Bus.idRuta = Ruta.id LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM Bus;";
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
            $sql = "SELECT Bus.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde,' - ',Ruta.hasta) as 'Ruta' FROM Bus INNER JOIN Coperativa ON Bus.idCoperativa = Coperativa.id INNER JOIN Ruta ON Bus.idRuta = Ruta.id WHERE $nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT Bus.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde,' - ',Ruta.hasta) as 'Ruta' FROM Bus INNER JOIN Coperativa ON Bus.idCoperativa = Coperativa.id INNER JOIN Ruta ON Bus.idRuta = Ruta.id WHERE $nombreColumna LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT Bus.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde,' - ',Ruta.hasta) as 'Ruta' FROM Bus INNER JOIN Coperativa ON Bus.idCoperativa = Coperativa.id INNER JOIN Ruta ON Bus.idRuta = Ruta.id WHERE $nombreColumna LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT Bus.*, Coperativa.nombre as 'Coperativa', CONCAT(Ruta.desde,' - ',Ruta.hasta) as 'Ruta' FROM Bus INNER JOIN Coperativa ON Bus.idCoperativa = Coperativa.id INNER JOIN Ruta ON Bus.idRuta = Ruta.id WHERE $nombreColumna LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}