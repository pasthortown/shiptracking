import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AdjuntoRoutingModule } from './adjunto-routing.module';
import { AdjuntoComponent } from './adjunto.component';
import { AdjuntoService } from './adjunto.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      AdjuntoRoutingModule
   ],
   providers: [AdjuntoService],
   declarations: [AdjuntoComponent],
})
export class AdjuntoModule { }
