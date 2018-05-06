import { CoperativaService } from './../coperativa/coperativa.service';
import { Coperativa } from './../../../entidades/CRUD/Coperativa';
import { CuentaService } from './../cuenta/cuenta.service';
import { Cuenta } from './../../../entidades/CRUD/Cuenta';
import { RolService } from './../rol/rol.service';
import { GeneroService } from './../genero/genero.service';
import { Genero } from './../../../entidades/CRUD/Genero';
import { Rol } from './../../../entidades/CRUD/Rol';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Persona } from '../../../entidades/CRUD/Persona';
import { PersonaService } from './persona.service';

import 'rxjs/add/operator/toPromise';
import { ModalComponent } from '../../bs-component/components';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
   selector: 'app-persona',
   templateUrl: './persona.component.html',
   styleUrls: ['./persona.component.scss']
})

export class PersonaComponent implements OnInit {

   busy: Promise<any>;
   entidades: Persona[];
   entidadSeleccionada: Persona;
   pagina: 1;
   tamanoPagina: 20;
   paginaActual: number;
   paginaUltima: number;
   registrosPorPagina: number;
   esVisibleVentanaEdicion: boolean;
   roles: Rol[];
   generos: Genero[];
   coperativas: Coperativa[];
   cuenta: Cuenta;
   validarClave: Boolean;
   claveConfirm: string;
   claveNueva: string;

   constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private coperativaService:CoperativaService, private cuentaService: CuentaService, private generoService: GeneroService, private rolService: RolService, private dataService: PersonaService, private modalService: NgbModal) {
      this.toastr.setRootViewContainerRef(vcr);
   }

   open(content, nuevo){
      if(nuevo){
         this.resetEntidadSeleccionada();
      }
      this.modalService.open(content)
      .result
      .then((result => {
          if(!this.validarClave){
              return;
          }
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

   getCoperativas(): void {
      this.busy = this.coperativaService
      .getAll()
      .then(entidadesRecuperadas => {
         this.coperativas = entidadesRecuperadas;
      })
      .catch(error => {

      });
   }

   getGeneros(): void {
      this.busy = this.generoService
      .getAll()
      .then(entidadesRecuperadas => {
         this.generos = entidadesRecuperadas;
      })
      .catch(error => {

      });
   }

   getRoles(): void {
      this.busy = this.rolService
      .getAll()
      .then(entidadesRecuperadas => {
         this.roles = entidadesRecuperadas;
      })
      .catch(error => {

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

   isValid(entidadPorEvaluar: Persona): boolean {
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

   crearEntidad(): Persona {
      let nuevoPersona = new Persona();
      nuevoPersona.id = 0;
      nuevoPersona.idGenero = 0;
      return nuevoPersona;
   }

   add(entidadNueva: Persona): void {
      this.busy = this.dataService.create(entidadNueva)
      .then(respuesta => {
         if(respuesta){
            this.busy = this.dataService.getFiltrado('identificacion','coincide',entidadNueva.identificacion)
            .then(personaCreada => {
                this.cuenta.idPersona = personaCreada[0].id;
                this.busy = this.cuentaService.create(this.cuenta)
                .then(respuestaCuenta => {
                    if(respuestaCuenta){
                        this.toastr.success('Datos registrados satisfactoriamente', 'Creación');
                        this.refresh();
                    }else{
                        this.toastr.warning('Se produjo un error', 'Creación');
                    }
                })
                .catch(error => {
                    this.toastr.warning('Se produjo un error', 'Creación');
                });
            })
            .catch(error => {

            });
         }else{
            this.toastr.warning('Se produjo un error', 'Creación');
         }
      })
      .catch(error => {
         this.toastr.warning('Se produjo un error', 'Creación');
      });
   }

   update(entidadParaActualizar: Persona): void {
      this.busy = this.dataService.update(entidadParaActualizar)
      .then(respuesta => {
         if(respuesta){
            this.busy = this.cuentaService.update(this.cuenta)
            .then(respuestaCuenta => {
               if(respuestaCuenta){
                  this.toastr.success('La actualización fue exitosa', 'Actualización');
               }else{
                  this.toastr.warning('Se produjo un error', 'Actualización');
               }
               this.refresh();
            })
            .catch(error => {
               this.toastr.warning('Se produjo un error', 'Actualización');
            });
         }else{
            this.toastr.warning('Se produjo un error', 'Actualización');
         }
      })
      .catch(error => {
         this.toastr.warning('Se produjo un error', 'Actualización');
      });
   }

   delete(entidadParaBorrar: Persona): void {
      this.cuenta.idRol = 1;
      this.busy = this.cuentaService.update(this.cuenta)
        .then(respuestaCuenta => {
            if(respuestaCuenta){
                this.toastr.success('La desactivación de la cuenta fue exitosa', 'Desactivación');
            }else{
                this.toastr.warning('Se produjo un error', 'Desactivación');
            }
            this.refresh();
        })
        .catch(error => {
            this.toastr.warning('Se produjo un error', 'Desactivación');
        });
   }

   refresh(): void {
      this.getNumeroPaginas(this.registrosPorPagina);
      this.getPagina(this.paginaActual,this.registrosPorPagina);
      this.entidades = Persona[0];
      this.entidadSeleccionada = this.crearEntidad();
      this.cuenta = new Cuenta();
      this.cuenta.idCoperativa = 0;
      this.cuenta.idRol = 0;
      this.getGeneros();
      this.getRoles();
      this.getCoperativas();
      this.validarClaveEvent();
   }

   validarClaveEvent():void {
       if(this.claveNueva == null || this.claveNueva == '' || this.claveConfirm == null || this.claveConfirm == '' || this.claveConfirm != this.claveNueva){
           this.validarClave = false;
       }else {
           this.validarClave = true;
           this.cuenta.clave = this.claveNueva;
       }
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

   onSelect(entidadActual: Persona): void {
      this.entidadSeleccionada = entidadActual;
      this.busy = this.cuentaService.getFiltrado('idPersona', 'coincide', entidadActual.id.toString())
      .then(respuesta => {
         this.cuenta = respuesta[0];
         this.claveConfirm = '';
         this.claveNueva = '';
         this.validarClaveEvent();
      })
      .catch(error => {

      });
   }
}
