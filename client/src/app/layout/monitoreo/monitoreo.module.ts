import { LocationService } from './../origenes_externos/location.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MonitoreoRoutingModule } from './monitoreo-routing.module';
import { MonitoreoComponent } from './monitoreo.component';
import { CoperativaService } from '../CRUD/coperativa/coperativa.service';
import { UnidadService } from '../CRUD/unidad/unidad.service';
import { ParadaService } from '../CRUD/parada/parada.service';
import { PosicionesService } from '../CRUD/posiciones/posiciones.service';

@NgModule({
    imports: [CommonModule, MonitoreoRoutingModule, FormsModule],
    declarations: [MonitoreoComponent],
    providers: [CoperativaService, UnidadService, ParadaService, PosicionesService, LocationService]
})
export class MonitoreoModule {}
