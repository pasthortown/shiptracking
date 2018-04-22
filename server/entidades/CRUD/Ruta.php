<?php
class Ruta
{
   public $id;
   public $desde;
   public $hasta;

   function __construct($id,$desde,$hasta){
      $this->id = $id;
      $this->desde = $desde;
      $this->hasta = $hasta;
   }
}
?>