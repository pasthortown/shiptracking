import { CuentaService } from './../CRUD/cuenta/cuenta.service';
import { PersonaService } from './../CRUD/persona/persona.service';
import { GeneroService } from './../CRUD/genero/genero.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { PerfilComponent } from './perfil.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PerfilRoutingModule
  ],
  providers: [GeneroService, PersonaService, CuentaService],
  declarations: [PerfilComponent]
})
export class PerfilModule { }
