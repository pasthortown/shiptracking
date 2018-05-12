<?php
class Posiciones
{
   public $id;
   public $idUnidad;
   public $tiempo;
   public $latitud;
   public $longitud;
   public $velocidad;

   function __construct($id,$idUnidad,$tiempo,$latitud,$longitud,$velocidad){
      $this->id = $id;
      $this->idUnidad = $idUnidad;
      $this->tiempo = $tiempo;
      $this->latitud = $latitud;
      $this->longitud = $longitud;
      $this->velocidad = $velocidad;
   }
}
?>