import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RolRoutingModule } from './rol-routing.module';
import { RolComponent } from './rol.component';
import { RolService } from './rol.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      RolRoutingModule
   ],
   providers: [RolService],
   declarations: [RolComponent],
})
export class RolModule { }
