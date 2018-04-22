import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoperativaComponent } from './coperativa.component';

const routes: Routes = [
   { path: '', component: CoperativaComponent }
];

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class CoperativaRoutingModule { }
