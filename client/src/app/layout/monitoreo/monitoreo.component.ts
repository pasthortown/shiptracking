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
    posiciones = [];
    paradas: Parada[];
    poly: google.maps.Polyline;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private coperativaService: CoperativaService, private unidadService: UnidadService, private paradaService: ParadaService, private posicionesService: PosicionesService) {
        this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        this.refresh();
    }

    refresh() {
        this.mostrarUnidades = false;
        this.getTotalizadores();
        this.startGoogleMap();
        this.posiciones = [];
    }

    startGoogleMap() {
        const mapProp = {
            center: new google.maps.LatLng(-0.224710, -78.516763),
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
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
                let marker2 = new google.maps.Marker({
                    position: location,
                    map: this.map,
                    draggable: false,
                    icon: image,
                    title: unidad.registroMunicipal + ' - ' + unidad.placa
                });
                let infowindow = new google.maps.InfoWindow({
                    content: '<div><h3>' + marker2.getTitle() + '</h3><h5>'+ monitoreoActual.velocidad + ' - ' + monitoreoActual.tiempo +'</h5></div>'
                });
                marker2.addListener('click', function() {
                    infowindow.open(this.map, marker2);
                });
            })
            .catch(error => {
                this.toastr.warning('Se produjo un error', 'Lectura de Datos');
            });
        });
    }

    actualizarMonitoreo(){
        this.startGoogleMap();
        this.mostrarUnidadesMapa();
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

    cambioVisibilidad(idUnidad: number, valor: Boolean){

    }
}
