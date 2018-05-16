import { LocationService } from './../origenes_externos/location.service';
import { PosicionesService } from './../CRUD/posiciones/posiciones.service';
import { ParadaService } from './../CRUD/parada/parada.service';
import { CoperativaService } from './../CRUD/coperativa/coperativa.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes.component';
import { UnidadService } from '../CRUD/unidad/unidad.service';

@NgModule({
    imports: [CommonModule, ReportesRoutingModule, FormsModule],
    declarations: [ReportesComponent],
    providers: [CoperativaService, UnidadService, ParadaService, PosicionesService, LocationService]
})
export class ReportesModule {}
