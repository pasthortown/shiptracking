import { element } from 'protractor';
import { MonitoreoUnidad } from './../../entidades/especifico/MonitoreoUnidad';
import { PosicionesService } from './../CRUD/posiciones/posiciones.service';
import { ParadaService } from './../CRUD/parada/parada.service';
import { Parada } from './../../entidades/CRUD/Parada';
import { TipoUnidadService } from './../CRUD/tipounidad/tipounidad.service';
import { TipoUnidad } from './../../entidades/CRUD/TipoUnidad';
import { Posiciones } from './../../entidades/CRUD/Posiciones';
import { UnidadService } from './../CRUD/unidad/unidad.service';
import { Unidad } from './../../entidades/CRUD/Unidad';
import { CoperativaService } from './../CRUD/coperativa/coperativa.service';
import { Totalizadores } from './../../entidades/especifico/Totalizadores';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { } from '@types/googlemaps';

@Component({
    selector: 'app-monitoreo',
    templateUrl: './monitoreo.component.html',
    styleUrls: ['./monitoreo.component.scss']
})
export class MonitoreoComponent implements OnInit {
    totalizadores:Totalizadores[];
    @ViewChild('gmap') gmapElement: any;
    map: google.maps.Map;
    latitude: any;
    longitude: any;
    busy: Promise<any>;
    unidades: Unidad[];
    mostrarUnidades: boolean;
    totalizadorSeleccionado: Totalizadores;
    rutaMostrada: MonitoreoUnidad[];
    marcadoresRutaMostrada = [];
    paradas: Parada[];
    poly: google.maps.Polyline;
    monitoreando: Boolean;
    minutosRefrescar: number;
    unidadesMonitoreadasMarcador = [];
    unidadSeleccionada: Unidad;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private coperativaService: CoperativaService, private unidadService: UnidadService, private paradaService: ParadaService, private posicionesService: PosicionesService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.mostrarUnidades = false;
        this.monitoreando = false;
        this.getTotalizadores();
        this.startGoogleMap();
        this.rutaMostrada = [];
        this.unidadesMonitoreadasMarcador = [];
        this.minutosRefrescar = 0;
    }

    startGoogleMap() {
        const mapProp = {
            center: new google.maps.LatLng(-0.224710, -78.516763),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        this.poly = new google.maps.Polyline({
            strokeColor: '#79b7f2',
            strokeOpacity: 1,
            strokeWeight: 3,
            geodesic: true,
            map: this.map
         });
    }

    onSelect(totalizador: Totalizadores) {
        this.unidades = [];
        this.totalizadorSeleccionado = totalizador;
        this.mostrarUnidades = true;
        this.busy = this.unidadService.getFiltrado('idCoperativa','coincide',totalizador.idCoperativa.toString())
        .then(respuesta => {
            this.unidades = respuesta;
            this.mostrarUnidadesMapa();
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Lectura de Datos');
            this.mostrarUnidades = false;
        });
    }

    mostrarUnidadesMapa(){
        this.unidadesMonitoreadasMarcador.forEach(element => {
            element.setMap(null);
        });
        this.unidadesMonitoreadasMarcador = [];
        this.unidades.forEach(unidad=>{
            this.busy = this.posicionesService.getMonitoreoUnidadActual(this.totalizadorSeleccionado.idCoperativa, unidad.id)
            .then(respuesta => {
                let monitoreoActual = respuesta[0];
                var image = {
                    url: unidad.TipoUnidad,
                    size: new google.maps.Size(40, 40),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(17, 34),
                    scaledSize: new google.maps.Size(40, 40)
                };
                let location = new google.maps.LatLng(JSON.parse(monitoreoActual.latitud) as number,JSON.parse(monitoreoActual.longitud) as number);
                let marker = new google.maps.Marker({
                    position: location,
                    map: this.map,
                    draggable: false,
                    icon: image,
                    title: unidad.numero + '. ' + unidad.placa + ' ' + unidad.registroMunicipal
                });
                let infowindow = new google.maps.InfoWindow({
                    content: '<div><h4>' + marker.getTitle() + '</h4><h5>' + monitoreoActual.tiempo + ': ' + monitoreoActual.velocidad + '</h5></div>'
                });
                marker.addListener('click', function() {
                    infowindow.open(this.map, marker);
                });
                this.unidadesMonitoreadasMarcador.push(marker);
            })
            .catch(error => {
                this.toastr.warning('Se produjo un error', 'Lectura de Datos');
            });
        });
    }

    onSelectUnidad(unidad: Unidad){
        this.unidadSeleccionada = unidad;
        this.poly.setMap(null);
        this.poly = new google.maps.Polyline({
            strokeColor: '#79b7f2',
            strokeOpacity: 1,
            strokeWeight: 3,
            geodesic: true,
            map: this.map
        });
        this.marcadoresRutaMostrada.forEach(element => {
            element.setMap(null);
        });
        this.marcadoresRutaMostrada = [];
        this.busy = this.posicionesService.getMonitoreoUnidad(this.totalizadorSeleccionado.idCoperativa, unidad.id, new Date())
        .then(respuesta => {
            this.rutaMostrada = respuesta;
            this.rutaMostrada.forEach(monitoreoActual => {
                let location = new google.maps.LatLng(JSON.parse(monitoreoActual.latitud) as number,JSON.parse(monitoreoActual.longitud) as number);
                this.poly.getPath().push(location);
                var image = {
                    url: 'http://shiptracking.000webhostapp.com/images/parada.png',
                    size: new google.maps.Size(30, 30),
                    origin: new google.maps.Point(-5, -5),
                    anchor: new google.maps.Point(30, 30),
                    scaledSize: new google.maps.Size(30, 30)
                };
                let marker = new google.maps.Marker({
                    position: location,
                    map: this.map,
                    draggable: false,
                    icon: image,
                    title: monitoreoActual.tiempo + ' ' + monitoreoActual.velocidad
                });
                this.marcadoresRutaMostrada.push(marker);
            });
        })
        .catch(error => {

        });
    }

    estaSeleccionadaUnidad(unidad: Unidad): boolean {
        if (this.unidadSeleccionada == null) {
            return false;
        }
        return this.unidadSeleccionada.id === unidad.id;
    }

    actualizarMonitoreo() {
        this.unidadesMonitoreadasMarcador.forEach(marcador => {
            this.unidades.forEach(unidad => {
                if(marcador.getTitle() === unidad.numero + '. ' + unidad.placa + ' ' + unidad.registroMunicipal){
                    this.busy = this.posicionesService.getMonitoreoUnidadActual(this.totalizadorSeleccionado.idCoperativa, unidad.id)
                    .then(respuesta => {
                        let monitoreoActual = respuesta[0];
                        let location = new google.maps.LatLng(JSON.parse(monitoreoActual.latitud) as number,JSON.parse(monitoreoActual.longitud) as number);
                        marcador.setTitle(unidad.numero + '. ' + unidad.placa + ' ' + unidad.registroMunicipal);
                        let infowindow = new google.maps.InfoWindow({
                            content: '<div><h4>' + marcador.getTitle() + '</h4><h5>' + monitoreoActual.tiempo + ': ' + monitoreoActual.velocidad + '</h5></div>'
                        });
                        google.maps.event.clearListeners(marcador,'click');
                        marcador.addListener('click', function() {
                            infowindow.open(this.map, marcador);
                        });
                        marcador.setPosition(location);
                    })
                    .catch(error => {

                    });
                }
            });
        });
    }

    iniciarMonitoreo() {
        this.monitoreando = true;
        this.monitoreoContinuo();
    }

    monitoreoContinuo(){
        this.actualizarMonitoreo();
        if ( this.monitoreando) {
            setTimeout(() => {
            this.monitoreoContinuo();
            }, this.minutosRefrescar*1000);
        }
    }

    detenerMonitoreo() {
        this.monitoreando = false;
    }

    estaSeleccionadoTotalizador(porVerificar): boolean {
        if (this.totalizadorSeleccionado == null) {
            return false;
        }
        return this.totalizadorSeleccionado.Coperativa === porVerificar.Coperativa;
    }

    getTotalizadores() {
        this.busy = this.coperativaService.totalizadores()
        .then(respuesta => {
            if(JSON.stringify(respuesta) == '[0]'){
                this.totalizadores = [];
                return;
            }
            this.totalizadores = respuesta;
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Consulta de datos');
        });
    }
}
