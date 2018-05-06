<?php
class Posiciones
{
   public $id;
   public $idUnidad;
   public $tiempo;
   public $latitud;
   public $longitud;

   function __construct($id,$idUnidad,$tiempo,$latitud,$longitud){
      $this->id = $id;
      $this->idUnidad = $idUnidad;
      $this->tiempo = $tiempo;
      $this->latitud = $latitud;
      $this->longitud = $longitud;
   }
}
?>