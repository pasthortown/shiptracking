<?php
class Unidad
{
   public $id;
   public $idCoperativa;
   public $placa;
   public $numero;
   public $anoFabricacion;
   public $registroMunicipal;
   public $idTipoUnidad;

   function __construct($id,$idCoperativa,$placa,$numero,$anoFabricacion,$registroMunicipal,$idTipoUnidad){
      $this->id = $id;
      $this->idCoperativa = $idCoperativa;
      $this->placa = $placa;
      $this->numero = $numero;
      $this->anoFabricacion = $anoFabricacion;
      $this->registroMunicipal = $registroMunicipal;
      $this->idTipoUnidad = $idTipoUnidad;
   }
}
?>