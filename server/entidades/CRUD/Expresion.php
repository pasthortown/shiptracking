<?php
class Expresion
{
   public $id;
   public $idRemitente;
   public $idBus;
   public $contenido;
   public $respuesta;
   public $idCalificacion;
   public $idAdjunto;

   function __construct($id,$idRemitente,$idBus,$contenido,$respuesta,$idCalificacion,$idAdjunto){
      $this->id = $id;
      $this->idRemitente = $idRemitente;
      $this->idBus = $idBus;
      $this->contenido = $contenido;
      $this->respuesta = $respuesta;
      $this->idCalificacion = $idCalificacion;
      $this->idAdjunto = $idAdjunto;
   }
}
?>