import { Parada } from './../../../entidades/CRUD/Parada';
import { ParadaService } from './../parada/parada.service';
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
   paradas: Parada[];
   poly: google.maps.Polyline;
   tiempoEstimado: string;

   constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private paradaService: ParadaService, private dataService: RutaService, private modalService: NgbModal) {
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
      this.paradas = [];
      this.refreshMarkers();
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
        this.poly = new google.maps.Polyline({
            strokeColor: '#79b7f2',
            strokeOpacity: 0,
            strokeWeight: 3,
            geodesic: true,
            map: this.map
         });
        let poly = this.poly;
        console.log(paradas);
        if(paradas.length==0){
            paradas = [];
        }
        paradas.forEach(paradaBDD => {
            let location = new google.maps.LatLng(JSON.parse(paradaBDD.latitud) as number,JSON.parse(paradaBDD.longitud) as number);
            let marker2 = new google.maps.Marker({
                position: location,
                map: this.map,
                draggable: false,
                icon: image,
                title: paradaBDD.numero + ' - ' + paradaBDD.nombre
            });
            let infowindow = new google.maps.InfoWindow({
                content: '<div><h3>' + marker2.getTitle() + '</h3></div>'
            });
            marker2.addListener('click', function() {
                infowindow.open(this.map, marker2);
            });
            poly.getPath().push(location);
        });
        this.map.addListener('click', function(event) {
            let location = event.latLng;
            poly.getPath().push(location);
            let marker = new google.maps.Marker({
                position: location,
                map: mapa,
                draggable: true,
                icon: image,
                title: 'nuevo'
            });
            let numeroParada = poly.getPath().getLength();
            let infowindow = new google.maps.InfoWindow({
                content: '<div><h3>' + numeroParada + ' - ' + marker.getTitle() + '</h3></div>'
            });
            marker.addListener('click', function() {
                infowindow.open(this.map, marker);
            });
            let paradaNueva = new Parada();
            paradaNueva.numero = numeroParada;
            paradaNueva.latitud = marker.getPosition().toJSON().lat.toString();
            paradaNueva.longitud = marker.getPosition().toJSON().lng.toString();
            paradaNueva.nombre = marker.getTitle();
            paradaNueva.tiempoEstimado = 300;
            paradas.push(paradaNueva);
        });
        this.poly = poly;
        this.paradas = paradas;
   }

   onSelect(entidadActual: Ruta): void {
      this.entidadSeleccionada = entidadActual;
      this.refreshMarkers();
   }

   refreshMarkers(): void {
      let image = './../../../../assets/images/parada.png';
      this.getParadas(this.entidadSeleccionada.id);
   }

   saveMarkers(): void {
      let cuenta = 0;
      console.log(this.paradas);
      this.paradas.forEach(parada => {
        this.busy = this.paradaService.getFiltrado('idRuta','coincide',this.entidadSeleccionada.id.toString())
        .then(respuesta => {
            if (JSON.stringify(respuesta) !== '[0]') {
                respuesta.forEach(element => {
                    this.busy = this.paradaService.remove(element.id);
                });
            }
            parada.idRuta = this.entidadSeleccionada.id;
            this.busy = this.paradaService.create(parada)
            .then(respuesta => {
                cuenta++;
                if(cuenta == this.paradas.length){
                    this.toastr.success('Paradas Guardadas Satisfactoriamente', 'Guardar Paradas');
                    this.refreshMarkers();
                }
            })
            .catch(error => {

            });
        })
        .catch(error => {

        });
      });
   }

   getParadas(id: number): void {
       this.busy = this.paradaService.getFiltrado('idRuta','coincide',id.toString())
        .then(respuesta => {
            if (JSON.stringify(respuesta) === '[0]') {
                this.paradas = [];
                this.startGoogleMap();
                return;
            }
            this.paradas = respuesta;
            let minutos = 0;
            this.paradas.forEach(element => {
                minutos = Math.floor(minutos + (element.tiempoEstimado/60));
                this.tiempoEstimado = minutos + ' minutos';
            });
            this.startGoogleMap();
        })
        .catch(error => {

        });
   }

   deleteMarker(parada:number): void {
        this.busy = this.paradaService.remove(parada)
        .then(respuesta => {
            this.toastr.success('Parada Borrada Satisfactoriamente', 'Borrar Parada');
            this.refreshMarkers();
        })
        .catch(error => {

        });
   }
}
