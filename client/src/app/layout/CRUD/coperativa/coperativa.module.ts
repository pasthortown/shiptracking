import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CoperativaRoutingModule } from './coperativa-routing.module';
import { CoperativaComponent } from './coperativa.component';
import { CoperativaService } from './coperativa.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      CoperativaRoutingModule
   ],
   providers: [CoperativaService],
   declarations: [CoperativaComponent],
})
export class CoperativaModule { }
