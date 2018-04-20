import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperienciasComponent } from './experiencias.component';

const routes: Routes = [
    {
        path: '',
        component: ExperienciasComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExperienciasRoutingModule {}
