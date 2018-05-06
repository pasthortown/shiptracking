import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TipoUnidadRoutingModule } from './tipounidad-routing.module';
import { TipoUnidadComponent } from './tipounidad.component';
import { TipoUnidadService } from './tipounidad.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      TipoUnidadRoutingModule
   ],
   providers: [TipoUnidadService],
   declarations: [TipoUnidadComponent],
})
export class TipoUnidadModule { }
