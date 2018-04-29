import { element } from 'protractor';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Ruta } from '../../../entidades/CRUD/Ruta';
import { RutaService } from './ruta.service';

import { } from '@types/googlemaps';
import 'rxjs/add/operator/toPromise';
import { ModalComponent } from '../../bs-component/components';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
   selector: 'app-ruta',
   templateUrl: './ruta.component.html',
   styleUrls: ['./ruta.component.scss']
})

export class RutaComponent implements OnInit {
   @ViewChild('gmap') gmapElement: any;
   map: google.maps.Map;

   busy: Promise<any>;
   entidades: Ruta[];
   entidadSeleccionada: Ruta;
   pagina: 1;
   tamanoPagina: 20;
   paginaActual: number;
   paginaUltima: number;
   registrosPorPagina: number;
   esVisibleVentanaEdicion: boolean;
   editando:boolean;
   paradas: google.maps.Marker[];

   constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private dataService: RutaService, private modalService: NgbModal) {
      this.toastr.setRootViewContainerRef(vcr);
   }

   open(content, nuevo){
      if(nuevo){
         this.resetEntidadSeleccionada();
      }
      this.modalService.open(content)
      .result
      .then((result => {
         if(result=="save"){
            this.aceptar();
         }
      }),(result => {
         //Esto se ejecuta si la ventana se cierra sin aceptar los cambios
      }));
   }

   estaSeleccionado(porVerificar): boolean {
      if (this.entidadSeleccionada == null) {
         return false;
      }
      return porVerificar.id === this.entidadSeleccionada.id;
   }

   cerrarVentanaEdicion(): void {
      this.esVisibleVentanaEdicion = false;
   }

   mostrarVentanaNuevo(): void {
      this.resetEntidadSeleccionada();
      this.esVisibleVentanaEdicion = true;
   }

   mostrarVentanaEdicion(): void {
      this.esVisibleVentanaEdicion = true;
   }

   resetEntidadSeleccionada(): void {
      this.entidadSeleccionada = this.crearEntidad();
   }

   getAll(): void {
      this.busy = this.dataService
      .getAll()
      .then(entidadesRecuperadas => {
         this.entidades = entidadesRecuperadas
         if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
            this.toastr.success('¡No hay datos!', 'Consulta');
         } else {
            this.toastr.success('La consulta fue exitosa', 'Consulta');
         }
      })
      .catch(error => {
         this.toastr.success('Se produjo un error', 'Consulta');
      });
   }

   getPagina(pagina: number, tamanoPagina: number): void {
      this.busy = this.dataService
      .getPagina(pagina, tamanoPagina)
      .then(entidadesRecuperadas => {
         this.entidades = entidadesRecuperadas
         if (entidadesRecuperadas == null || entidadesRecuperadas.length === 0) {
            this.toastr.success('¡No hay datos!', 'Consulta');
         } else {
            this.toastr.success('La consulta fue exitosa', 'Consulta');
         }
      })
      .catch(error => {
         this.toastr.success('Se produjo un error', 'Consulta');
      });
   }

   getNumeroPaginas(tamanoPagina: number): void{
      this.busy = this.dataService
      .getNumeroPaginas(tamanoPagina)
      .then(respuesta => {
         this.paginaUltima = respuesta.paginas;
      })
      .catch(error => {
         //Error al leer las paginas
      });
   }

   isValid(entidadPorEvaluar: Ruta): boolean {
      return true;
   }

   aceptar(): void {
      if (!this.isValid(this.entidadSeleccionada)) {return;}
      if (this.entidadSeleccionada.id === undefined || this.entidadSeleccionada.id === 0) {
         this.add(this.entidadSeleccionada);
      } else {
         this.update(this.entidadSeleccionada);
      }
      this.cerrarVentanaEdicion();
   }

   crearEntidad(): Ruta {
      const nuevoRuta = new Ruta();
      nuevoRuta.id = 0;
      return nuevoRuta;
   }

   add(entidadNueva: Ruta): void {
      this.busy = this.dataService.create(entidadNueva)
      .then(respuesta => {
         if(respuesta){
            this.toastr.success('La creación fue exitosa', 'Creación');
         }else{
            this.toastr.warning('Se produjo un error', 'Creación');
         }
         this.refresh();
      })
      .catch(error => {
         this.toastr.warning('Se produjo un error', 'Creación');
      });
   }

   update(entidadParaActualizar: Ruta): void {
      this.busy = this.dataService.update(entidadParaActualizar)
      .then(respuesta => {
         if(respuesta){
            this.toastr.success('La actualización fue exitosa', 'Actualización');
         }else{
            this.toastr.warning('Se produjo un error', 'Actualización');
         }
         this.refresh();
      })
      .catch(error => {
         this.toastr.warning('Se produjo un error', 'Actualización');
      });
   }

   delete(entidadParaBorrar: Ruta): void {
      this.busy = this.dataService.remove(entidadParaBorrar.id)
      .then(respuesta => {
         if(respuesta){
            this.toastr.success('La eliminación fue exitosa', 'Eliminación');
         }else{
            this.toastr.warning('Se produjo un error', 'Eliminación');
         }
         this.refresh();
      })
      .catch(error => {
         this.toastr.success('Se produjo un error', 'Eliminación');
      });
   }

   refresh(): void {
      this.getNumeroPaginas(this.registrosPorPagina);
      this.getPagina(this.paginaActual,this.registrosPorPagina);
      this.entidades = Ruta[0];
      this.entidadSeleccionada = this.crearEntidad();
   }

   getPaginaPrimera():void {
      this.paginaActual = 1;
      this.refresh();
   }

   getPaginaAnterior():void {
      if(this.paginaActual>1){
         this.paginaActual = this.paginaActual - 1;
         this.refresh();
      }
   }

   getPaginaSiguiente():void {
      if(this.paginaActual < this.paginaUltima){
         this.paginaActual = this.paginaActual + 1;
         this.refresh();
      }
   }

   getPaginaUltima():void {
      this.paginaActual = this.paginaUltima;
      this.refresh();
   }

   ngOnInit() {
        this.editando = false;
        this.paradas = [];
        this.paginaActual=1;
        this.registrosPorPagina = 5;
        this.refresh();
        this.startGoogleMap();
   }

   startGoogleMap() {
        const mapProp = {
            center: new google.maps.LatLng(-0.224710, -78.516763),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        this.mapReady();
   }

   mapReady() {
        this.permitirAgregarMarcadoresConClick();
   }

   permitirAgregarMarcadoresConClick() {
        let image = './../../../../assets/images/parada.png';
        let mapa = this.map;
        let paradas = this.paradas;
        if(this.paradas.length>0){
            let paradas = this.paradas;
        }else {
            paradas = [];
        }
        this.map.addListener('click', function(event) {
            let location = event.latLng;
            let marker = new google.maps.Marker({
                position: location,
                map: mapa,
                draggable: true,
                icon: image,
                title: 'nuevo'
            });
            let infowindow = new google.maps.InfoWindow({
                content: '<div><h3>' + marker.getTitle() + '</h3></div>'
            });
            marker.addListener('click', function() {
                infowindow.open(this.map, marker);
            });
            paradas.push(marker);
        });
        this.paradas = paradas;
   }

   addMarker(position:google.maps.LatLng, titulo: string, popUpContent: string, image: string, draggable: boolean) {
        let infowindow = new google.maps.InfoWindow({
            content: popUpContent
        });
        let marker = new google.maps.Marker({
            position: position,
            map: this.map,
            draggable: draggable,
            icon: image,
            title: titulo
        });
        marker.addListener('click', function() {
            infowindow.open(this.map, marker);
        });
   }

   editar(): void {
      if(this.editando) {
          this.editando = false;
      }else{
          this.editando = true;
      }
   }

   onSelect(entidadActual: Ruta): void {
      this.entidadSeleccionada = entidadActual;
   }

   refreshMarkers(): void {
      this.startGoogleMap();
      let poly = new google.maps.Polyline({
        strokeColor: '#79b7f2',
        strokeOpacity: 0.75,
        strokeWeight: 3,
        geodesic: true,
        map: this.map
      });
      let image = './../../../../assets/images/parada.png';
      let marcadorAnterior: google.maps.Marker;
      let map = this.map;
      this.paradas.forEach(element => {
          var path = poly.getPath();
          path.push(element.getPosition());
          if (marcadorAnterior== null){
              marcadorAnterior = element;
          }
          this.addMarker(element.getPosition(),element.getTitle(),'<div><h3>' + element.getTitle() + '</h3></div>',image,false);
          marcadorAnterior = element;
      });
   }

   deleteMarker(marker:google.maps.Marker): void {
       let nuevosMarcadores = [];
       this.paradas.forEach(element => {
          if(element.getTitle() !== marker.getTitle()){
              nuevosMarcadores.push(element);
          }
       });
       this.paradas = nuevosMarcadores;
       this.refreshMarkers();
   }
}
