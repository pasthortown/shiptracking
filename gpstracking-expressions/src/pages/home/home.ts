import { Persona } from './../register/Persona';
import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  usuario: string;

  constructor(public navCtrl: NavController) {

  }

  ngOnInit(){
    let contenido = JSON.parse(sessionStorage.getItem('logedResult')) as Persona;
    this.usuario = contenido.nombres + ' ' + contenido.apellidos;
  }
}
