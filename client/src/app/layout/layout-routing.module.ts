import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
            { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            { path: 'forms', loadChildren: './form/form.module#FormModule' },
            { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
            { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
            { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
            { path: 'monitoreo', loadChildren: './monitoreo/monitoreo.module#MonitoreoModule' },
            { path: 'experiencias', loadChildren: './experiencias/experiencias.module#ExperienciasModule' },
            { path: 'bus', loadChildren: './CRUD/bus/bus.module#BusModule' },
            { path: 'coperativa', loadChildren: './CRUD/coperativa/coperativa.module#CoperativaModule' },
            { path: 'parada', loadChildren: './CRUD/parada/parada.module#ParadaModule' },
            { path: 'persona', loadChildren: './CRUD/persona/persona.module#PersonaModule' },
            { path: 'ruta', loadChildren: './CRUD/ruta/ruta.module#RutaModule' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
