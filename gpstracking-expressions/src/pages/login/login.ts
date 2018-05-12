import { RegisterPage } from './../register/register';
import { TabsPage } from './../tabs/tabs';
import { LoginRequest } from './Login-Request';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit{
  webServiceURL = 'http://shiptracking.000webhostapp.com/server/login/';
  loginRequest: LoginRequest;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, public http: Http) {
  }

  ngOnInit() {
    this.loginRequest = new LoginRequest();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ingresar() {
    this.http.post(this.webServiceURL + 'cuenta',JSON.stringify(this.loginRequest))
    .subscribe(respuesta => {
      if (respuesta.json().idRol == 0) {
        this.showToast('Credenciales Incorrectos');
        localStorage.removeItem('isLoggedin');
        sessionStorage.removeItem('logedResult');
        return;
      }
      sessionStorage.setItem('logedResult', JSON.stringify(respuesta.json().Persona));
      localStorage.setItem('isLoggedin', 'true');
      this.navCtrl.push(TabsPage);
    }, error => {
      localStorage.removeItem('isLoggedin');
      sessionStorage.removeItem('logedResult');
      this.showToast('Ocurrió un error al autenticar');
    });
  }

  passwordRecovery() {
    if(this.loginRequest.email == null || this.loginRequest.email == ''){
      this.showToast('Ingrese su correo electrónico');
      return;
    }
    this.http.get(this.webServiceURL + 'passwordRecovery?email='+this.loginRequest.email)
    .subscribe(respuesta => {
      this.showToast('La contraseña ha cambiado, revise su correo electrónico');
    }, error => {
      this.showToast('Ocurrió un error al recuperar la contraseña');
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

  register(){
    this.navCtrl.push(RegisterPage);
  }
}
