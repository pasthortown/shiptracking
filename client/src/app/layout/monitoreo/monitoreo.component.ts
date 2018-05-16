import { LocationService } from './../origenes_externos/location.service';
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
    mostrarDatosRecorrido: Boolean;
    OnlineServiceInfo = [];
    Odometros = [];
    InformacionDiariaRutas = [];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private coperativaService: CoperativaService, private unidadService: UnidadService, private paradaService: ParadaService, private posicionesService: PosicionesService, private locationService: LocationService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.mostrarUnidades = false;
        this.mostrarDatosRecorrido = false;
        this.monitoreando = false;
        this.getTotalizadores();
        this.startGoogleMap();
        this.rutaMostrada = [];
        this.unidadesMonitoreadasMarcador = [];
        this.minutosRefrescar = 0;
    }

    getOdometros(){
        this.busy = this.locationService.getOdometros()
        .then(respuesta => {
            this.Odometros = respuesta[0];
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Lectura de Datos');
        });
    }

    getOnlineServiceInfo(){
        this.busy = this.locationService.getOnlineServiceInfo()
        .then(respuesta => {
            this.OnlineServiceInfo = respuesta[0];
            this.mostrarUnidadesMapa();
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Lectura de Datos');
        });
    }

    getInformacionDiariaRutas(){
        let fechaBuscar = new Date();
        this.busy = this.locationService.getInformacionDiariaRutas(new Date(fechaBuscar.getFullYear().toString() + '-' + (fechaBuscar.getMonth() + 1).toString() + '-' + (fechaBuscar.getDate() - 5).toString()))
        .then(respuesta => {
            this.InformacionDiariaRutas = respuesta[0];
            this.InformacionDiariaRutas.forEach(element => {
                element.Alias = element.Alias.split('-')[1].trim();
            });
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Lectura de Datos');
        });
    }

    startGoogleMap() {
        const mapProp = {
            center: new google.maps.LatLng(-0.224710, -78.516763),
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
        this.poly = new google.maps.Polyline({
            strokeColor: '#ed8917',
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
            this.getOnlineServiceInfo();
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Lectura de Datos');
            this.mostrarUnidades = false;
        });
        this.getInformacionDiariaRutas();
    }

    mostrarUnidadesMapa(){
        this.unidadesMonitoreadasMarcador.forEach(element => {
            element.setMap(null);
        });
        this.unidadesMonitoreadasMarcador = [];
        this.unidades.forEach(unidad=>{
            this.OnlineServiceInfo.forEach(deviceInfo => {
                if(unidad.placa == deviceInfo.alias.split('-')[1].trim()){
                    var image = {
                        url: 'http://shiptracking.000webhostapp.com/images/marcador.png',
                        size: new google.maps.Size(100, 30),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(100, 30),
                        scaledSize: new google.maps.Size(100, 30)
                    };
                    let location = new google.maps.LatLng(JSON.parse(deviceInfo.latitude) as number,JSON.parse(deviceInfo.longitude) as number);
                    let marker = new google.maps.Marker({
                        position: location,
                        map: this.map,
                        draggable: false,
                        icon: image,
                        label: unidad.numero + '. ' + Math.floor(deviceInfo.speed).toString() + 'Km/h',
                        title: unidad.numero + '. ' + unidad.placa
                    });
                    let infowindow = new google.maps.InfoWindow({
                        content: '<div><h4>' + marker.getTitle() + '</h4>'+
                                 '<h5>' + Math.floor(deviceInfo.speed) + ' Km/h</h5>'+
                                 '<h6><strong>Kilometraje: </strong>' + Math.floor(deviceInfo.odometer) + '</h6>'+
                                 '<small>' + new Date() + '</small>'+
                                 '</div>'
                    });
                    marker.addListener('click', function() {
                        infowindow.open(this.map, marker);
                    });
                    this.unidadesMonitoreadasMarcador.push(marker);
                }
            });
        });
    }

    onSelectUnidad(unidad: Unidad){
        this.unidadSeleccionada = unidad;
        this.poly.setMap(null);
        this.poly = new google.maps.Polyline({
            strokeColor: '#ed8917',
            strokeOpacity: 1,
            strokeWeight: 3,
            geodesic: true,
            map: this.map
        });
        /*this.marcadoresRutaMostrada.forEach(element => {
            element.setMap(null);
        });
        this.marcadoresRutaMostrada = [];*/
        this.OnlineServiceInfo.forEach(deviceInfo => {
            if(unidad.placa == deviceInfo.alias.split('-')[1].trim()){
                this.map.setCenter(new google.maps.LatLng(deviceInfo.latitude, deviceInfo.longitude));
            }
        });
    }

    estaSeleccionadaUnidad(unidad: Unidad): boolean {
        if (this.unidadSeleccionada == null) {
            this.mostrarDatosRecorrido = false;
            return false;
        }
        this.mostrarDatosRecorrido = true;
        return this.unidadSeleccionada.id === unidad.id;
    }

    actualizarMonitoreo() {
        this.busy = this.locationService.getOnlineServiceInfo()
        .then(respuesta => {
            this.OnlineServiceInfo = respuesta[0];
            this.unidadesMonitoreadasMarcador.forEach(marcador => {
                this.unidades.forEach(unidad => {
                    if(marcador.getTitle() === unidad.numero + '. ' + unidad.placa){
                        this.OnlineServiceInfo.forEach(deviceInfo => {
                            if(unidad.placa == deviceInfo.alias.split('-')[1].trim()){
                                let location = new google.maps.LatLng(JSON.parse(deviceInfo.latitude) as number,JSON.parse(deviceInfo.longitude) as number);
                                marcador.setTitle(unidad.numero + '. ' + unidad.placa);
                                marcador.setLabel(unidad.numero + '. ' + Math.floor(deviceInfo.speed).toString() + 'Km/h');
                                let infowindow = new google.maps.InfoWindow({
                                    content: '<div><h4>' + marcador.getTitle() + '</h4>'+
                                             '<h5>' + Math.floor(deviceInfo.speed) + ' Km/h</h5>'+
                                             '<h6><strong>Kilometraje: </strong>' + Math.floor(deviceInfo.odometer) + '</h6>'+
                                             '<small>' + new Date() + '</small>'+
                                             '</div>'
                                });
                                google.maps.event.clearListeners(marcador,'click');
                                marcador.addListener('click', function() {
                                    infowindow.open(this.map, marcador);
                                });
                                marcador.setPosition(location);
                            }
                        });
                    }
                });
            });
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Lectura de Datos');
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
