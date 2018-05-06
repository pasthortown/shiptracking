import { GeneroService } from './../genero/genero.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PersonaRoutingModule } from './persona-routing.module';
import { PersonaComponent } from './persona.component';
import { PersonaService } from './persona.service';
import { RolService } from '../rol/rol.service';

@NgModule({
   imports: [
      CommonModule,
      FormsModule,
      PersonaRoutingModule
   ],
   providers: [PersonaService, GeneroService, RolService],
   declarations: [PersonaComponent],
})
export class PersonaModule { }
