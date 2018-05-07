import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            { path: 'perfil', loadChildren: './perfil/perfil.module#PerfilModule' },
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
            { path: 'unidad', loadChildren: './CRUD/unidad/unidad.module#UnidadModule' },
            { path: 'tipounidad', loadChildren: './CRUD/tipounidad/tipounidad.module#TipoUnidadModule' },
            { path: 'posiciones', loadChildren: './CRUD/posiciones/posiciones.module#PosicionesModule' },
            { path: 'coperativa', loadChildren: './CRUD/coperativa/coperativa.module#CoperativaModule' },
            { path: 'persona', loadChildren: './CRUD/persona/persona.module#PersonaModule' },
            { path: 'ruta', loadChildren: './CRUD/ruta/ruta.module#RutaModule' },
            { path: 'rol', loadChildren: './CRUD/rol/rol.module#RolModule' },
            { path: 'genero', loadChildren: './CRUD/genero/genero.module#GeneroModule' },
            { path: 'expresion', loadChildren: './CRUD/expresion/expresion.module#ExpresionModule' },
            { path: 'calificacion', loadChildren: './CRUD/calificacion/calificacion.module#CalificacionModule' },
            { path: 'auditoria', loadChildren: './CRUD/auditoria/auditoria.module#AuditoriaModule' },
            { path: 'adjunto', loadChildren: './CRUD/adjunto/adjunto.module#AdjuntoModule' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule {}
