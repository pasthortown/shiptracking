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
   providers: [BusService],
   declarations: [BusComponent],
})
export class BusModule { }
