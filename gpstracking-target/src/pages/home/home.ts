import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { Camera } from '@ionic-native/camera';
import { ToastController } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{

  webServiceURL = 'http://qrstore.000webhostapp.com/QRStore/';
  qrEscaneado: string;

  constructor(public navCtrl: NavController, public http: Http, public camera: Camera, public toastCtrl: ToastController, private barcodeScanner: BarcodeScanner) {

  }

  ngOnInit() {

  }

  scanCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.qrEscaneado = barcodeData.text;
      this.suscribirGPS();
    }, (err) => {
      console.log('Error: ', err);
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
}
