import { AdjuntoService } from './../CRUD/adjunto/adjunto.service';
import { UnidadService } from './../CRUD/unidad/unidad.service';
import { PersonaService } from './../CRUD/persona/persona.service';
import { ExpresionService } from './../CRUD/expresion/expresion.service';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

import { ExperienciasRoutingModule } from './experiencias-routing.module';
import { ExperienciasComponent } from './experiencias.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        ExperienciasRoutingModule],
    declarations: [ExperienciasComponent],
    providers: [ExpresionService, PersonaService, UnidadService, AdjuntoService]
})
export class ExperienciasModule {}
