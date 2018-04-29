import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdjuntoComponent } from './adjunto.component';

const routes: Routes = [
   { path: '', component: AdjuntoComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class AdjuntoRoutingModule { }
