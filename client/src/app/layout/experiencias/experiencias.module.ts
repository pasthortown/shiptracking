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
    declarations: [ExperienciasComponent]
})
export class ExperienciasModule {}
