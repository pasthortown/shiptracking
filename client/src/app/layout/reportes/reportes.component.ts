import { LocationService } from './../origenes_externos/location.service';
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
    fechaSeleccionada: Date;
    mostrarDatosRecorrido: Boolean;
    rutaMostrada: MonitoreoUnidad[];
    paradas: Parada[];
    poly: google.maps.Polyline;
    marcadoresRutaMostrada = [];
    unidadSeleccionada: Unidad;
    InformacionDiariaRutas = [];

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private coperativaService: CoperativaService, private unidadService: UnidadService, private posicionesService: PosicionesService, private paradaService: ParadaService, private locationService: LocationService) {
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
        this.rutaMostrada = [];
        this.paradas = [];
        this.unidadSeleccionada = new Unidad();
        this.unidadSeleccionada.id = 0;
        this.fechaSeleccionada = new Date();
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
                return;
            }
        });
    }

    generarReporte() {
        this.InformacionDiariaRutas = [];
        this.mostrarDatosRecorrido = true;
        let fechaBuscar = new Date(this.fechaSeleccionada);
        this.busy = this.locationService.getInformacionDiariaRutas(new Date(fechaBuscar.getFullYear().toString() + '-' + (fechaBuscar.getMonth() + 1).toString() + '-' + (fechaBuscar.getDate() - 5).toString()))
        .then(respuesta => {
            this.InformacionDiariaRutas = respuesta[0];
            this.InformacionDiariaRutas.forEach(element => {
                element.Alias = element.Alias.split('-')[1].trim();
            });
        })
        .catch(error => {
            this.toastr.success('La fecha seleccionada, no tiene registros', 'Lectura de Datos');
        });
    }
}
