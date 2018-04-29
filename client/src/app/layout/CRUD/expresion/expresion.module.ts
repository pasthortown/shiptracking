import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ExpresionRoutingModule } from './expresion-routing.module';
import { ExpresionComponent } from './expresion.component';
import { ExpresionService } from './expresion.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      ExpresionRoutingModule
   ],
   providers: [ExpresionService],
   declarations: [ExpresionComponent],
})
export class ExpresionModule { }
