import { LoginPage } from './../login/login';
import { Adjunto } from './Adjunto';
import { Expresion } from './Expresion';
import { Unidad } from './Unidad';
import { Persona } from './../register/Persona';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  @ViewChild('fileInput') fileInput;
  unidad: Unidad;
  expresion: Expresion;
  persona: Persona;
  webServiceURL = 'http://192.168.1.102/shiptracking/server/';
  fotografia = null;
  adjunto: Adjunto;
  confirmado: Boolean = false;

  constructor(public navCtrl: NavController, private barcodeScanner: BarcodeScanner, public camera: Camera, public toastCtrl: ToastController, public http: Http) {

  }

  ngOnInit(){
    this.persona = JSON.parse(sessionStorage.getItem('logedResult')) as Persona;
    this.unidad = new Unidad();
    this.unidad.id = 0;
    this.expresion = new Expresion();
    this.adjunto = new Adjunto();
    this.adjunto.id = 0;
  }

  enviar(){
    if(!this.confirmado){
      this.showToast('Por favor, confirme los datos de la unidad');
      return;
    }
    let fecha = new Date();
    let tokenTime = fecha.getFullYear().toString()+'-'+(fecha.getMonth()+1).toString()+'-'+fecha.getDate().toString()+'-'+fecha.getHours().toString()+'-'+fecha.getMinutes().toString()+'-'+fecha.getMilliseconds().toString();
    this.expresion.idRemitente = this.persona.id;
    if(this.unidad.id == 0) {
      if(this.unidad.registroMunicipal == '' || this.unidad.registroMunicipal == null){
        this.showToast('Por favor, ingrese o escanee el registro municipal de la unidad');
        return;
      }
    }
    if(!(this.adjunto.nombreArchivo == '' || this.adjunto.nombreArchivo == null)){
      let nuevoNombre = tokenTime + this.adjunto.nombreArchivo;
      this.adjunto.nombreArchivo = nuevoNombre;
      this.http.post(this.webServiceURL + 'adjunto/crear',JSON.stringify(this.adjunto))
      .subscribe(respuesta => {
        if(respuesta.json()){
          this.http.get(this.webServiceURL + 'adjunto/leer_filtrado?columna=nombreArchivo&tipo_filtro=coincide&filtro='+this.adjunto.nombreArchivo)
          .subscribe(respuesta => {
            this.expresion.idAdjunto = respuesta.json()[0].id;
            this.registrarExpresion();
          }, error => {
            this.showToast('Ocurrió un error');
          });
        }
      }, error => {

      });
    }
    return;

  }

  registrarExpresion(){
    this.http.post(this.webServiceURL + 'expresion/crear',JSON.stringify(this.expresion))
    .subscribe(respuesta => {
      if (respuesta.json()){
        this.showToast('Hemos receptado tu opinión, en breve la atenderemos');
        this.unidad = new Unidad();
        this.unidad.id = 0;
        this.expresion = new Expresion();
        this.adjunto = new Adjunto();
        this.adjunto.id = 0;
        localStorage.removeItem('isLoggedin');
        sessionStorage.removeItem('logedResult');
        this.navCtrl.push(LoginPage);
      }else {
        this.showToast('Ocurrió un error');
      }
    }, error => {
      this.showToast('Ocurrió un error');
    });
  }

  escanear(){
    this.barcodeScanner.scan().then(barcodeData => {
      this.buscar(barcodeData.text);
    }, (err) => {
      this.showToast('Ocurrió un error. Por favor, vuelva a intentarlo');
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
      this.expresion.idBus = this.unidad.id;
      this.showToast('Datos de unidad confirmados');
      this.confirmado = true;

    }, error => {
      this.showToast('Ocurrió un error');
    });
  }

  getPicture():void {
    if (Camera['installed']()) {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        allowEdit: true
      }
      this.camera.getPicture(options).then((imageData) => {
        this.adjunto.nombreArchivo = 'foto_desde_camara.jpg';
        this.adjunto.tipoArchivo = 'image/jpeg';
        this.adjunto.adjunto = imageData;
        this.fotografia = 'data:' + this.adjunto.tipoArchivo + ';base64,' + this.adjunto.adjunto;
       }, (err) => {
         this.fotografia = null;
      });
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  subirPicture(){
    this.fileInput.nativeElement.click();
  }

  subirImagen(event) {
    const reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = () => {
              this.adjunto.nombreArchivo = file.name;
              this.adjunto.tipoArchivo = file.type;
              this.adjunto.adjunto = reader.result.split(',')[1];;
              this.fotografia = 'data:' + this.adjunto.tipoArchivo + ';base64,' + this.adjunto.adjunto;
            };
        }
  }
}
