import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParadaComponent } from './parada.component';

const routes: Routes = [
   { path: '', component: ParadaComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ParadaRoutingModule { }
