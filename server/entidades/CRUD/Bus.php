<?php
class Bus
{
   public $id;
   public $idCoperativa;
   public $idRuta;
   public $placa;
   public $numero;
   public $anoFabricacion;
   public $registroMunicipal;

   function __construct($id,$idCoperativa,$idRuta,$placa,$numero,$anoFabricacion,$registroMunicipal){
      $this->id = $id;
      $this->idCoperativa = $idCoperativa;
      $this->idRuta = $idRuta;
      $this->placa = $placa;
      $this->numero = $numero;
      $this->anoFabricacion = $anoFabricacion;
      $this->registroMunicipal = $registroMunicipal;
   }
}
?>