import { UnidadService } from './../unidad/unidad.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AsignacionRutaRoutingModule } from './asignacionruta-routing.module';
import { AsignacionRutaComponent } from './asignacionruta.component';
import { AsignacionRutaService } from './asignacionruta.service';
import { RutaService } from '../ruta/ruta.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      AsignacionRutaRoutingModule
   ],
   providers: [AsignacionRutaService, RutaService, UnidadService],
   declarations: [AsignacionRutaComponent],
})
export class AsignacionRutaModule { }
