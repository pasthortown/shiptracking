import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RutaRoutingModule } from './ruta-routing.module';
import { RutaComponent } from './ruta.component';
import { RutaService } from './ruta.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      RutaRoutingModule
   ],
   providers: [RutaService],
   declarations: [RutaComponent],
})
export class RutaModule { }
