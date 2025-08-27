import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile';
import {Home} from './pages/home/home';
import { ConfiguracionProfile } from './pages/configuracion-profile/configuracion-profile';
import { Calendario } from './pages/calendario/calendario';
import { DatosPersonales } from './pages/datos-personales/datos-personales';
import { Reportes } from './pages/reportes/reportes';

export const routes: Routes = [
    { path: 'profile', component: ProfileComponent, title: 'Perfil' },
    { path: 'home', component: Home, title: 'Inicio' },
    { path: 'configuracion-profile', 
        component: ConfiguracionProfile,
        title: 'Configuración de Perfil',
        children: [
            { path: '', redirectTo: 'datos-personales', pathMatch: 'full' },
            { path: 'datos-personales', component: DatosPersonales, title: 'Datos Personales' },
            { path: 'reportes', component: Reportes, title: 'Reportes' }
        ] },
    { path: 'calendario', component: Calendario, title: 'Calendario' },
];
