import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { ProfileComponent } from './pages/profile/profile';
import {Home} from './pages/home/home';
import { ConfiguracionProfile } from './pages/configuracion-profile/configuracion-profile';
import { Calendario } from './pages/calendario/calendario';
import { DatosPersonales } from './pages/datos-personales/datos-personales';
import { Reportes } from './pages/reportes/reportes';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Rutas de autenticación (sin protección)
  { 
    path: 'login', 
    loadComponent: () => import('./module/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./module/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'post-register',
    loadComponent: () => import('./module/auth/register/post-register/post-register.component').then(m => m.PostRegisterComponent)
  },
      
  // Ruta padre con hijas (protegida)
  { 
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { 
        path: 'home', 
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      { path: 'configuracion-profile', 
        component: ConfiguracionProfile,
        title: 'Configuración de Perfil',
        children: [
            { path: '', redirectTo: 'datos-personales', pathMatch: 'full' },
            { path: 'datos-personales', component: DatosPersonales, title: 'Datos Personales' },
            { path: 'reportes', component: Reportes, title: 'Reportes' }
        ] },
    { path: 'calendario', component: Calendario, title: 'Calendario' },
    ]
  },
  
  // Ruta wildcard
  { path: '**', redirectTo: '/login' }
];
