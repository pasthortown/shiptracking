<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/especificos/LoginResult.php');
include_once('../entidades/CRUD/Persona.php');
class Controlador_login extends Controlador_Base
{
   function cuenta($args)
   { 
       $email = $args["email"];
       $clave = $args["clave"];
       $sql = "SELECT Persona.*, Cuenta.idRol as 'idRol' FROM Persona INNER JOIN Cuenta ON Cuenta.idPersona = Persona.id WHERE Persona.correoElectronico = ? AND Cuenta.clave = aes_encrypt(?,'gps_tracking');";
       $parametros = array($email, $clave);
       $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
       if(is_null($respuesta[0])||$respuesta[0]==0){
          return new LoginResult(0,new Persona);
       }else{
           $PersonaLogged = new Persona($respuesta[0]["id"],$respuesta[0]["identificacion"],$respuesta[0]["nombres"],$respuesta[0]["apellidos"],$respuesta[0]["idGenero"],$respuesta[0]["direccion"],$respuesta[0]["telefono1"],$respuesta[0]["telefono2"],$respuesta[0]["correoElectronico"]);
           $loginResult = new LoginResult((int)$respuesta[0]["idRol"],$PersonaLogged);
           return $loginResult;
       }
       return false;
   }
}