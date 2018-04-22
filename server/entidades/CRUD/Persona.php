<?php
class Persona
{
   public $id;
   public $identificacion;
   public $nombres;
   public $apellidos;
   public $idGenero;
   public $direccion;
   public $telefono1;
   public $telefono2;
   public $correoElectronico;

   function __construct($id,$identificacion,$nombres,$apellidos,$idGenero,$direccion,$telefono1,$telefono2,$correoElectronico){
      $this->id = $id;
      $this->identificacion = $identificacion;
      $this->nombres = $nombres;
      $this->apellidos = $apellidos;
      $this->idGenero = $idGenero;
      $this->direccion = $direccion;
      $this->telefono1 = $telefono1;
      $this->telefono2 = $telefono2;
      $this->correoElectronico = $correoElectronico;
   }
}
?>