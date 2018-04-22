<?php
class Cuenta
{
   public $id;
   public $idPersona;
   public $idRol;
   public $idCoperativa;
   public $clave;

   function __construct($id,$idPersona,$idRol,$idCoperativa,$clave){
      $this->id = $id;
      $this->idPersona = $idPersona;
      $this->idRol = $idRol;
      $this->idCoperativa = $idCoperativa;
      $this->clave = $clave;
   }
}
?>