import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PosicionesRoutingModule } from './posiciones-routing.module';
import { PosicionesComponent } from './posiciones.component';
import { PosicionesService } from './posiciones.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      PosicionesRoutingModule
   ],
   providers: [PosicionesService],
   declarations: [PosicionesComponent],
})
export class PosicionesModule { }
