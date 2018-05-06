import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipoUnidadComponent } from './tipounidad.component';

const routes: Routes = [
   { path: '', component: TipoUnidadComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class TipoUnidadRoutingModule { }
