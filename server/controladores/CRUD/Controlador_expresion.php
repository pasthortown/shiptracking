<?php
include_once('../controladores/Controlador_Base.php');
include_once('../entidades/CRUD/Expresion.php');
include_once('../controladores/especificos/Controlador_mail_sender.php');

class Controlador_expresion extends Controlador_Base
{
   function crear($args)
   {
      $expresion = new Expresion($args["id"],$args["idRemitente"],$args["idBus"],$args["contenido"],$args["respuesta"],$args["idCalificacion"],$args["idAdjunto"]);
      $sql = "INSERT INTO Expresion (idRemitente,idBus,contenido,respuesta,idCalificacion,idAdjunto) VALUES (?,?,?,?,?,?);";
      $parametros = array($expresion->idRemitente,$expresion->idBus,$expresion->contenido,$expresion->respuesta,$expresion->idCalificacion,$expresion->idAdjunto);
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function actualizar($args)
   {
      $expresion = new Expresion($args["id"],$args["idRemitente"],$args["idBus"],$args["contenido"],$args["respuesta"],$args["idCalificacion"],$args["idAdjunto"]);
      $parametros = array($expresion->idRemitente,$expresion->idBus,$expresion->contenido,$expresion->respuesta,$expresion->idCalificacion,$expresion->idAdjunto,$expresion->id);
      $sql = "UPDATE Expresion SET idRemitente = ?,idBus = ?,contenido = ?,respuesta = ?,idCalificacion = ?,idAdjunto = ? WHERE id = ?;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function totalizadores($args)
   {
      $parametros = array();
      $sql = "SELECT Coperativa.nombre as 'Coperativa', COUNT(Expresion.id) as 'Cuenta', Coperativa.id as 'idCoperativa' FROM Expresion INNER JOIN Unidad ON Expresion.idBus = Unidad.id INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa WHERE Expresion.idCalificacion is null GROUP BY Coperativa.nombre, Coperativa.id ORDER BY Coperativa.nombre, Coperativa.id ASC;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function borrar($args)
   {
      $id = $args["id"];
      $parametros = array($id);
      $sql = "DELETE FROM Expresion WHERE id = ?;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      if(is_null($respuesta[0])){
         return true;
      }else{
         return false;
      }
   }

   function leer($args)
   {
      $id = $args["id"];
      if ($id==""){
         $sql = "SELECT Expresion.*, Unidad.placa as 'Placa', Unidad.numero as 'Numero', Coperativa.id as 'idCoperativa' FROM Expresion INNER JOIN Unidad ON Expresion.idBus = Unidad.id INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa ORDER BY Unidad.idCoperativa, Unidad.numero;";
      }else{
      $parametros = array($id);
         $sql = "SELECT Expresion.*, Unidad.placa as 'Placa', Unidad.numero as 'Numero', Coperativa.id as 'idCoperativa' FROM Expresion INNER JOIN Unidad ON Expresion.idBus = Unidad.id INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa WHERE id = ?;";
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function enviarRespuesta($args){
      $email = $args["email"];
      $usuario = $args["usuario"];
      $respuesta = $args["respuesta"];
      $mailSender = new Controlador_mail_sender();
      return $mailSender->enviarMail('gpstrackingec@gmail.com','GPS Tracking EC', '1509Charles*', 'gpstrackingec@gmail.com','Soporte al Consumidor',$email,$usuario,$respuesta,'Respuesta a Comentario/Sugerencia Recibido');
   }

   function leer_paginado($args)
   {
      $pagina = $args["pagina"];
      $registrosPorPagina = $args["registros_por_pagina"];
      $desde = (($pagina-1)*$registrosPorPagina);
      $sql ="SELECT Expresion.*, Unidad.placa as 'Placa', Unidad.numero as 'Numero', Coperativa.id as 'idCoperativa' FROM Expresion INNER JOIN Unidad ON Expresion.idBus = Unidad.id INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa WHERE Expresion.idCalificacion is null ORDER BY Unidad.idCoperativa, Unidad.numero LIMIT $desde,$registrosPorPagina;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }

   function numero_paginas($args)
   {
      $registrosPorPagina = $args["registros_por_pagina"];
      $sql ="SELECT IF(ceil(count(*)/$registrosPorPagina)>0,ceil(count(*)/$registrosPorPagina),1) as 'paginas' FROM Expresion;";
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta[0];
   }

   function leer_filtrado($args)
   {
      $nombreColumna = $args["columna"];
      $tipoFiltro = $args["tipo_filtro"];
      $filtro = $args["filtro"];
      switch ($tipoFiltro){
         case "coincide":
            $parametros = array($filtro);
            $sql = "SELECT Expresion.*, Unidad.placa as 'Placa', Unidad.numero as 'Numero', Coperativa.id as 'idCoperativa' FROM Expresion INNER JOIN Unidad ON Expresion.idBus = Unidad.id INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa WHERE $nombreColumna = ? AND Expresion.idCalificacion is null ORDER BY Unidad.idCoperativa, Unidad.numero;";
            break;
         case "inicia":
            $sql = "SELECT Expresion.*, Unidad.placa as 'Placa', Unidad.numero as 'Numero', Coperativa.id as 'idCoperativa' FROM Expresion INNER JOIN Unidad ON Expresion.idBus = Unidad.id INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa WHERE $nombreColumna LIKE '$filtro%' AND Expresion.idCalificacion is null ORDER BY Unidad.idCoperativa, Unidad.numero;";
            break;
         case "termina":
            $sql = "SELECT Expresion.*, Unidad.placa as 'Placa', Unidad.numero as 'Numero', Coperativa.id as 'idCoperativa' FROM Expresion INNER JOIN Unidad ON Expresion.idBus = Unidad.id INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa WHERE $nombreColumna LIKE '%$filtro' AND Expresion.idCalificacion is null ORDER BY Unidad.idCoperativa, Unidad.numero;";
            break;
         default:
            $sql = "SELECT Expresion.*, Unidad.placa as 'Placa', Unidad.numero as 'Numero', Coperativa.id as 'idCoperativa' FROM Expresion INNER JOIN Unidad ON Expresion.idBus = Unidad.id INNER JOIN Coperativa ON Coperativa.id = Unidad.idCoperativa WHERE $nombreColumna LIKE '%$filtro%' AND Expresion.idCalificacion is null ORDER BY Unidad.idCoperativa, Unidad.numero;";
            break;
      }
      $respuesta = $this->conexion->ejecutarConsulta($sql,$parametros);
      return $respuesta;
   }
}