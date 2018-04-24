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
      this.paginaActual=1;
      this.registrosPorPagina = 5;
      this.refresh();

      const mapProp = {
        center: new google.maps.LatLng(-0.224710, -78.516763),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    let location = new google.maps.LatLng(-0.224710, -78.516763);
    var contentString = '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
  '<div id="bodyContent">'+
  '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
  'sandstone rock formation in the southern part of the '+
  'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
  'south west of the nearest large town, Alice Springs; 450&#160;km '+
  '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
  'features of the Uluru - Kata Tjuta National Park. Uluru is '+
  'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
  'Aboriginal people of the area. It has many springs, waterholes, '+
  'rock caves and ancient paintings. Uluru is listed as a World '+
  'Heritage Site.</p>'+
  '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
  'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
  '(last visited June 22, 2009).</p>'+
  '</div>'+
  '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });

    var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      draggable: true,
      icon: image,
      title: 'YAVIRAC'
    });

    marker.addListener('click', function() {
        infowindow.open(this.map, marker);
      });

   }

   onSelect(entidadActual: Ruta): void {
      this.entidadSeleccionada = entidadActual;
   }
}
