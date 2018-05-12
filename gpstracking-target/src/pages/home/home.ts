import { Posiciones } from './Posiciones';
import { Unidad } from './Unidad';
import { Persona } from './Persona';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  webServiceURL = 'http://shiptracking.000webhostapp.com/server/';
  persona: Persona;
  unidad: Unidad;
  confirmado: Boolean = false;
  subscription = null;
  latitud: string;
  longitud: string;
  velocidad: string;
  ubicaciones: Posiciones[];

  constructor(public navCtrl: NavController, public http: Http, public camera: Camera, public toastCtrl: ToastController, private barcodeScanner: BarcodeScanner, private geolocation: Geolocation) {

  }

  ngOnInit() {
    this.persona = JSON.parse(sessionStorage.getItem('logedResult')) as Persona;
    this.unidad = new Unidad();
    this.ubicaciones = [];
    this.unidad.id = 0;
  }

  escanear(){
    this.barcodeScanner.scan().then(barcodeData => {
      this.buscar(barcodeData.text);
    }, (err) => {
      this.showToast('Ocurrió un error. Por favor, vuelva a intentarlo');
    });
  }

  buscar(registroMunicipal: string){
    if(registroMunicipal == '' || registroMunicipal == null){
      this.showToast('Por favor, ingrese o escanee el registro municipal de la unidad');
      return;
    }
    this.http.get(this.webServiceURL + 'unidad/leer_filtrado?columna=registroMunicipal&tipo_filtro=coincide&filtro='+registroMunicipal)
    .subscribe(respuesta => {
      if(respuesta.json()[0]==0){
        this.showToast('Registro municipal no encontrado');
        return;
      }
      this.unidad = respuesta.json()[0] as Unidad;
      this.showToast('Datos de unidad confirmados');
      this.confirmado = true;
    }, error => {
      this.showToast('Ocurrió un error');
    });
  }

  suscribirGPS() {
    this.http.get(this.webServiceURL)
    .subscribe(respuesta => {

    }, error => {

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

  iniciar():void {
    if(!this.confirmado){
      this.showToast('Por favor, confirme los datos de la unidad');
      return;
    }
    if(this.unidad.id == 0) {
      if(this.unidad.registroMunicipal == '' || this.unidad.registroMunicipal == null){
        this.showToast('Por favor, ingrese o escanee el registro municipal de la unidad');
        return;
      }
    }
    let options = {
      enableHighAccuracy: true,
      timeout: 15000
    };
    this.subscription = this.geolocation.watchPosition(options)
    .subscribe(position => {
      this.latitud = position.coords.latitude.toString();
      this.longitud = position.coords.longitude.toString();
      this.velocidad = (position.coords.speed * 3.6) + ' Km/h';
      let posicion = new Posiciones();
      posicion.latitud = this.latitud;
      posicion.longitud = this.longitud;
      posicion.velocidad = this.velocidad;
      posicion.idUnidad = this.unidad.id;
      posicion.tiempo = new Date();
      this.ubicaciones.push(posicion);
      if(this.ubicaciones.length == 4){
        this.http.post(this.webServiceURL + 'posiciones/crear',JSON.stringify(this.ubicaciones[0]))
        .subscribe(respuesta => {

        }, error => {

        });
        this.http.post(this.webServiceURL + 'posiciones/crear',JSON.stringify(this.ubicaciones[1]))
        .subscribe(respuesta => {

        }, error => {

        });
        this.http.post(this.webServiceURL + 'posiciones/crear',JSON.stringify(this.ubicaciones[2]))
        .subscribe(respuesta => {

        }, error => {

        });
        this.http.post(this.webServiceURL + 'posiciones/crear',JSON.stringify(this.ubicaciones[3]))
        .subscribe(respuesta => {

        }, error => {

        });
        this.ubicaciones=[];
      }
    });
  }

  detener():void {
    this.subscription.unsubscribe();
  }
}
