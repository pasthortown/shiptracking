<?php
class Posiciones
{
   public $id;
   public $idUnidad;
   public $tiempo;
   public $latitud;
   public $longitud;
   public $veloidad;

   function __construct($id,$idUnidad,$tiempo,$latitud,$longitud,$veloidad){
      $this->id = $id;
      $this->idUnidad = $idUnidad;
      $this->tiempo = $tiempo;
      $this->latitud = $latitud;
      $this->longitud = $longitud;
      $this->veloidad = $veloidad;
   }
}
?>