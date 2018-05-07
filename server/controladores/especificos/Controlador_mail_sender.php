<?php
include_once('../libs/PHPMailer/PHPMailer.php');
include_once('../libs/PHPMailer/POP3.php');
include_once('../libs/PHPMailer/SMTP.php');
include_once('../controladores/Controlador_Base.php');
use PHPMailer\PHPMailer\POP3;
use PHPMailer\PHPMailer\PHPMailer;
class Controlador_mail_sender extends Controlador_Base
{
   public function enviarMail($FromEmail, $FromAlias, $FromClave, $ReplyEmail, $ReplyAlias, $ToEmail, $ToAlias, $Mensaje, $Asunto) {
        $EstadoEnvio = false;
        try{
            $mail = new PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->Port = 587;
            $mail->SMTPSecure = 'tls';
            $mail->SMTPAuth = true;
            $mail->Username = $FromEmail;
            $mail->Password = $FromClave;
            $mail->setFrom( $FromEmail, $FromAlias );
            $mail->addReplyTo( $ReplyEmail, $ReplyAlias );
            $mail->addAddress($ToEmail, $ToAlias);
            $mail->Subject = $Asunto;
            $mail->msgHTML($Mensaje);
            $EstadoEnvio = $mail->send();
        }catch (Exception $e) {
            $EstadoEnvio = "Error de envio";
        }
        return $EstadoEnvio;
   }
}