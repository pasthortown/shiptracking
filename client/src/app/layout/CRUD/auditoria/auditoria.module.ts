import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuditoriaRoutingModule } from './auditoria-routing.module';
import { AuditoriaComponent } from './auditoria.component';
import { AuditoriaService } from './auditoria.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      AuditoriaRoutingModule
   ],
   providers: [AuditoriaService],
   declarations: [AuditoriaComponent],
})
export class AuditoriaModule { }
