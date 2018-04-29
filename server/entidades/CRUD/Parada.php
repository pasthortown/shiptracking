<?php
class Parada
{
   public $id;
   public $idRuta;
   public $numero;
   public $nombre;
   public $latitud;
   public $longitud;
   public $tiempoEstimado;

   function __construct($id,$idRuta,$numero,$nombre,$latitud,$longitud,$tiempoEstimado){
      $this->id = $id;
      $this->idRuta = $idRuta;
      $this->numero = $numero;
      $this->nombre = $nombre;
      $this->latitud = $latitud;
      $this->longitud = $longitud;
      $this->tiempoEstimado = $tiempoEstimado;
   }
}
?>