import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsignacionRutaComponent } from './asignacionruta.component';

const routes: Routes = [
   { path: '', component: AsignacionRutaComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class AsignacionRutaRoutingModule { }
