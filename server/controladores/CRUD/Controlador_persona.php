<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/Persona.php');
class Controlador_persona extends Controlador_Base
{
   function crear($args)
   {
      $persona = new Persona($args["id"],$args["identificacion"],$args["nombres"],$args["apellidos"],$args["idGenero"],$args["direccion"],$args["telefono1"],$args["telefono2"],$args["correoElectronico"]);
      $sql = "INSERT INTO Persona (identificacion,nombres,apellidos,idGenero,direccion,telefono1,telefono2,correoElectronico) VALUES (?,?,?,?,?,?,?,?);";
      $parametros = array($persona->identificacion,$persona->nombres,$persona->apellidos,$persona->idGenero,$persona->direccion,$persona->telefono1,$persona->telefono2,$persona->correoElectronico);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $persona = new Persona($args["id"],$args["identificacion"],$args["nombres"],$args["apellidos"],$args["idGenero"],$args["direccion"],$args["telefono1"],$args["telefono2"],$args["correoElectronico"]);
      $parametros = array($persona->identificacion,$persona->nombres,$persona->apellidos,$persona->idGenero,$persona->direccion,$persona->telefono1,$persona->telefono2,$persona->correoElectronico,$persona->id);
      $sql = "UPDATE Persona SET identificacion = ?,nombres = ?,apellidos = ?,idGenero = ?,direccion = ?,telefono1 = ?,telefono2 = ?,correoElectronico = ? WHERE id = ?;";
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
      $sql = "DELETE FROM Persona WHERE id = ?;";
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
         $sql = "SELECT * FROM Persona;";
      }else{
      $parametros = array($id);
         $sql = "SELECT * FROM Persona WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT * FROM Persona LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM Persona;";
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
            $sql = "SELECT * FROM Persona WHERE $nombreColumna = ?;";
            break;
         case "inicia":
            $sql = "SELECT * FROM Persona WHERE $nombreColumna LIKE '$filtro%';";
            break;
         case "termina":
            $sql = "SELECT * FROM Persona WHERE $nombreColumna LIKE '%$filtro';";
            break;
         default:
            $sql = "SELECT * FROM Persona WHERE $nombreColumna LIKE '%$filtro%';";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}