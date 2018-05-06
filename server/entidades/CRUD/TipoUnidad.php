<?php
class TipoUnidad
{
   public $id;
   public $descripcion;
   public $urlIcono;

   function __construct($id,$descripcion,$urlIcono){
      $this->id = $id;
      $this->descripcion = $descripcion;
      $this->urlIcono = $urlIcono;
   }
}
?>