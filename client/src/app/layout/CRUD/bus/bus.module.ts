import { RutaService } from './../ruta/ruta.service';
import { CoperativaService } from './../coperativa/coperativa.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BusRoutingModule } from './bus-routing.module';
import { BusComponent } from './bus.component';
import { BusService } from './bus.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      BusRoutingModule
   ],
   providers: [BusService, CoperativaService, RutaService],
   declarations: [BusComponent],
})
export class BusModule { }
