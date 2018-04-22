<?php
class Parada
{
   public $id;
   public $idRuta;
   public $nombre;
   public $latitud;
   public $longitud;

   function __construct($id,$idRuta,$nombre,$latitud,$longitud){
      $this->id = $id;
      $this->idRuta = $idRuta;
      $this->nombre = $nombre;
      $this->latitud = $latitud;
      $this->longitud = $longitud;
   }
}
?>