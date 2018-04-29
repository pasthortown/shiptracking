import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CalificacionRoutingModule } from './calificacion-routing.module';
import { CalificacionComponent } from './calificacion.component';
import { CalificacionService } from './calificacion.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      CalificacionRoutingModule
   ],
   providers: [CalificacionService],
   declarations: [CalificacionComponent],
})
export class CalificacionModule { }
