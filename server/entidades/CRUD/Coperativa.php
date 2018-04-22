<?php
class Coperativa
{
   public $id;
   public $RUC;
   public $nombre;
   public $direccion;
   public $telefono1;
   public $telefono2;

   function __construct($id,$RUC,$nombre,$direccion,$telefono1,$telefono2){
      $this->id = $id;
      $this->RUC = $RUC;
      $this->nombre = $nombre;
      $this->direccion = $direccion;
      $this->telefono1 = $telefono1;
      $this->telefono2 = $telefono2;
   }
}
?>