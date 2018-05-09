import { UnidadService } from './../unidad/unidad.service';
import { Ruta } from './../../../entidades/CRUD/Ruta';
import { Unidad } from './../../../entidades/CRUD/Unidad';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AsignacionRuta } from '../../../entidades/CRUD/AsignacionRuta';
import { AsignacionRutaService } from './asignacionruta.service';

import 'rxjs/add/operator/toPromise';
import { ModalComponent } from './../../bs-component/components';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { RutaService } from '../ruta/ruta.service';

@Component({
   selector: 'app-asignacionruta',
   templateUrl: './asignacionruta.component.html',
   styleUrls: ['./asignacionruta.component.scss']
})

export class AsignacionRutaComponent implements OnInit {

   busy: Promise<any>;
   entidades: AsignacionRuta[];
   entidadSeleccionada: AsignacionRuta;
   pagina: 1;
   tamanoPagina: 20;
   paginaActual: number;
   paginaUltima: number;
   registrosPorPagina: number;
   esVisibleVentanaEdicion: boolean;
   unidades: Unidad[];
   rutas: Ruta[];
   dias=[{'id':0, 'nombre':'Lunes'},{'id':1, 'nombre':'Martes'},{'id':2, 'nombre':'Miércoles'},{'id':3, 'nombre':'Jueves'},{'id':4, 'nombre':'Viernes'},{'id':5, 'nombre':'Sábado'},{'id':6, 'nombre':'Domingo'}];

   constructor(public toastr: ToastsManager, vcr: ViewContainerRef, private rutaService: RutaService, private unidadService: UnidadService, private dataService: AsignacionRutaService, private modalService: NgbModal) {
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
         this.entidades = entidadesRecuperadas;
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
         this.entidades.forEach(element => {
             this.dias.forEach(dia => {
                 if(dia.id ==element.diaSemana){
                    element.Dia = dia.nombre;
                 }
             });
         });
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

   isValid(entidadPorEvaluar: AsignacionRuta): boolean {
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

   crearEntidad(): AsignacionRuta {
      const nuevoAsignacionRuta = new AsignacionRuta();
      nuevoAsignacionRuta.id = 0;
      return nuevoAsignacionRuta;
   }

   add(entidadNueva: AsignacionRuta): void {
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

   update(entidadParaActualizar: AsignacionRuta): void {
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

   delete(entidadParaBorrar: AsignacionRuta): void {
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
      this.entidades = AsignacionRuta[0];
      this.entidadSeleccionada = this.crearEntidad();
      this.getRutas();
      this.getUnidades();
   }

   getRutas(): void {
      this.busy = this.rutaService
      .getAll()
      .then(entidadesRecuperadas => {
         this.rutas = entidadesRecuperadas;
      })
      .catch(error => {
         this.toastr.success('Se produjo un error', 'Consulta');
      });
   }

   getUnidades(): void {
      this.busy = this.unidadService
      .getAll()
      .then(entidadesRecuperadas => {
         this.unidades = entidadesRecuperadas;
      })
      .catch(error => {
         this.toastr.success('Se produjo un error', 'Consulta');
      });
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

   onSelect(entidadActual: AsignacionRuta): void {
      this.entidadSeleccionada = entidadActual;
   }
}
