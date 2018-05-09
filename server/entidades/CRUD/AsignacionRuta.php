<?php
class AsignacionRuta
{
   public $id;
   public $idRuta;
   public $idUnidad;
   public $diaSemana;

   function __construct($id,$idRuta,$idUnidad,$diaSemana){
      $this->id = $id;
      $this->idRuta = $idRuta;
      $this->idUnidad = $idUnidad;
      $this->diaSemana = $diaSemana;
   }
}
?>