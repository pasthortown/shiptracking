<?php
class Auditoria
{
   public $id;
   public $comando;
   public $nuevo;
   public $anterior;

   function __construct($id,$comando,$nuevo,$anterior){
      $this->id = $id;
      $this->comando = $comando;
      $this->nuevo = $nuevo;
      $this->anterior = $anterior;
   }
}
?>