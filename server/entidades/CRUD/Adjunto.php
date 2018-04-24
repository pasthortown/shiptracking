<?php
class Adjunto
{
   public $id;
   public $tipoArchivo;
   public $nombreArchivo;
   public $adjunto;

   function __construct($id,$tipoArchivo,$nombreArchivo,$adjunto){
      $this->id = $id;
      $this->tipoArchivo = $tipoArchivo;
      $this->nombreArchivo = $nombreArchivo;
      $this->adjunto = $adjunto;
   }
}
?>