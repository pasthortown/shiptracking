import { Expresion } from './Expresion';
import { Unidad } from './Unidad';
import { Persona } from './../register/Persona';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  unidad: Unidad;
  expresion: Expresion;
  persona: Persona;
  webServiceURL = 'http://localhost/shiptracking/server/';

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public http: Http) {

  }

  ngOnInit(){
    this.persona = JSON.parse(sessionStorage.getItem('logedResult')) as Persona;
    this.unidad = new Unidad();
    this.expresion = new Expresion();
  }

  enviar(){
    this.expresion.idRemitente = this.persona.id;
    this.expresion.idBus = this.unidad.id;
    this.http.post(this.webServiceURL + 'expresion/crear',JSON.stringify(this.expresion))
    .subscribe(respuesta => {
      if (respuesta.json()){
        this.showToast('Hemos receptado tu opinión, en breve la atenderemos');
      }else {
        this.showToast('Ocurrió un error');
      }
    }, error => {
      localStorage.removeItem('isLoggedin');
      sessionStorage.removeItem('logedResult');
      this.showToast('Ocurrió un error');
    });
  }

  showToast(mensaje: string):void {
    let toast = this.toastCtrl.create({
      message: mensaje,
      position: 'middle',
      duration: 3000
    });
    toast.present();
  }
}
