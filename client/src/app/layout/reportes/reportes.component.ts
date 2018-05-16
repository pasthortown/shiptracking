import { ParadaService } from './../CRUD/parada/parada.service';
import { Parada } from './../../entidades/CRUD/Parada';
import { PosicionesService } from './../CRUD/posiciones/posiciones.service';
import { MonitoreoUnidad } from './../../entidades/especifico/MonitoreoUnidad';
import { UnidadService } from './../CRUD/unidad/unidad.service';
import { Unidad } from './../../entidades/CRUD/Unidad';
import { CoperativaService } from './../CRUD/coperativa/coperativa.service';
import { Coperativa } from './../../entidades/CRUD/Coperativa';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { } from '@types/googlemaps';

@Component({
    selector: 'app-reportes',
    templateUrl: './reportes.component.html',
    styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
    busy: Promise<any>;
    coperativas: Coperativa[];
    unidades: Unidad[];
    idCoperativaSeleccionada: number;
    idUnidadSeleccionada: number;
    fechaSeleccionada: string;
    mostrarDatosRecorrido: Boolean;
    rutaMostrada: MonitoreoUnidad[];
    @ViewChild('gmap') gmapElement: any;
    map: google.maps.Map;
    paradas: Parada[];
    poly: google.maps.Polyline;
    marcadoresRutaMostrada = [];
    unidadSeleccionada: Unidad;
    fechas: string[];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private coperativaService: CoperativaService, private unidadService: UnidadService, private posicionesService: PosicionesService, private paradaService: ParadaService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.coperativas = [];
        this.unidades = [];
        this.refresh();
    }

    refresh() {
        this.getCoperativas();
        this.idCoperativaSeleccionada = 1;
        this.idUnidadSeleccionada = 0;
        this.mostrarDatosRecorrido = false;
        this.startGoogleMap();
        this.rutaMostrada = [];
        this.paradas = [];
        this.fechas = [];
        this.unidadSeleccionada = new Unidad();
        this.unidadSeleccionada.id = 0;
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

    getCoperativas() {
        this.busy = this.coperativaService.getAll()
        .then(respuesta => {
            this.coperativas = respuesta;
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Lectura de Datos');
        });
    }

    getUnidades(idCoperativa: number) {
        this.busy = this.unidadService.getFiltrado('idCoperativa', 'coincide', idCoperativa.toString())
        .then(respuesta => {
            this.unidades = respuesta;
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Lectura de Datos');
        });
    }

    seleccionarUnidad(idUnidad: number){
        this.unidadSeleccionada = new Unidad();
        this.unidadSeleccionada.id = 0;
        this.unidades.forEach(unidad => {
            if(unidad.id == idUnidad){
                this.unidadSeleccionada = unidad;
                this.getFechasMonitoreo(this.unidadSeleccionada.id);
                return;
            }
        });
    }

    getFechasMonitoreo(idUnidad: number){
        this.busy = this.posicionesService.getFechasMonitoreoUnidad(idUnidad)
        .then(respuesta => {
            this.fechas = respuesta;
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Lectura de Datos');
        });
    }

    onSelectFecha(){
        this.mostrarDatosRecorrido = true;
        this.poly.setMap(null);
        this.poly = new google.maps.Polyline({
            strokeColor: '#ed8917',
            strokeOpacity: 1,
            strokeWeight: 3,
            geodesic: true,
            map: this.map
        });
        this.marcadoresRutaMostrada.forEach(element => {
            element.setMap(null);
        });
        this.marcadoresRutaMostrada = [];
        this.busy = this.posicionesService.getMonitoreoUnidad(this.idCoperativaSeleccionada, this.unidadSeleccionada.id, new Date(this.fechaSeleccionada))
        .then(respuesta => {
            this.rutaMostrada = respuesta;
            this.rutaMostrada.forEach(monitoreoActual => {
                let location = new google.maps.LatLng(JSON.parse(monitoreoActual.latitud) as number,JSON.parse(monitoreoActual.longitud) as number);
                this.poly.getPath().push(location);
                var image = {
                    url: 'http://shiptracking.000webhostapp.com/images/punto.png',
                    size: new google.maps.Size(10, 10),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(10, 10),
                    scaledSize: new google.maps.Size(10, 10)
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
}
