import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ParadaRoutingModule } from './parada-routing.module';
import { ParadaComponent } from './parada.component';
import { ParadaService } from './parada.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ParadaRoutingModule
   ],
   providers: [ParadaService],
   declarations: [ParadaComponent],
})
export class ParadaModule { }
