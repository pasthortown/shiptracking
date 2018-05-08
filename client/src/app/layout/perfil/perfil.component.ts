import { CuentaService } from './../CRUD/cuenta/cuenta.service';
import { PersonaService } from './../CRUD/persona/persona.service';
import { Genero } from './../../entidades/CRUD/Genero';
import { GeneroService } from './../CRUD/genero/genero.service';
import { Persona } from './../../entidades/CRUD/Persona';
import { LoginResult } from '../../entidades/especifico/Login-Result';
import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
    selector: 'app-perfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit {
    @ViewChild('fileInput') fileInput;
    busy: Promise<any>;
    srcFoto: string;
    persona: Persona;
    generos: Genero[];
    personaLogeada: Persona;
    cambiandoClave: Boolean;
    validarClave: Boolean;
    confirmarNuevaClave: string;
    claveNueva: string;

    constructor(public toastr: ToastsManager, vcr: ViewContainerRef,private personaDataService: PersonaService,private generoDataService: GeneroService, private cuentaDataService: CuentaService) {
            this.toastr.setRootViewContainerRef(vcr);
    }

    ngOnInit() {
        const logedResult = JSON.parse(sessionStorage.getItem('logedResult')) as LoginResult;
        this.personaLogeada = logedResult.persona;
        this.persona = this.personaLogeada;
        this.validarClaveEvent();
        this.validarClave = false;
        this.cambiandoClave = false;
        this.getGeneros();
    }

    validarClaveEvent():void {
        if(this.claveNueva == null || this.claveNueva == ''){
            this.cambiandoClave = false;
        }else {
            this.cambiandoClave = true;
            if(this.claveNueva == null || this.claveNueva == '' || this.confirmarNuevaClave == null || this.confirmarNuevaClave == '' || this.confirmarNuevaClave != this.claveNueva){
                this.validarClave = false;
            }else {
                this.validarClave = true;
            }
        }
    }

    updateClave():void {
        if(!this.validarClave){
            this.toastr.warning('La clave no ha cambiado', 'Actualización de Clave');
            return;
        }
        if(!this.cambiandoClave){
            this.toastr.warning('La clave no ha cambiado', 'Actualización de Clave');
            return;
        }
        this.busy = this.cuentaDataService.getFiltrado('idPersona','coincide',this.persona.id.toString())
        .then(respuesta1 => {
            let cuentaActual = respuesta1[0];
            cuentaActual.clave = this.claveNueva;
            this.busy = this.cuentaDataService.update(cuentaActual)
            .then(respuesta => {
                if(respuesta){
                    this.toastr.success('La clave ha cambiado satisfactoriamente', 'Actualización de Clave');
                }else{
                    this.toastr.warning('Ocurrió un error', 'Actualización de Clave');
                }
            })
            .catch(error => {

            });
        })
        .catch(error => {

        });

    }

    getGeneros():void {
        this.busy = this.generoDataService.getAll()
        .then(respuesta => {
            this.generos = respuesta;
        })
        .catch(error => {

        });
    }

    cancelar(): void {
        this.toastr.warning('Los cambios fueron descartados', 'Actualización');
        this.ngOnInit();
    }

    update(): void {
        this.busy = this.personaDataService.update(this.persona)
        .then(respuesta => {
            if (respuesta) {
                this.toastr.success('Información actualizada satisfactoriamente', 'Actualización');
                const logedResult = JSON.parse(sessionStorage.getItem('logedResult')) as LoginResult;
                logedResult.persona = this.persona;
                sessionStorage.setItem('logedResult', JSON.stringify(logedResult));

            } else {
                this.toastr.warning('Se produjo un error', 'Actualización');
            }
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Actualización');
        });
    }
}
