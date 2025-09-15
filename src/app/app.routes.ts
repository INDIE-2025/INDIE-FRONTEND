import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotFoundRedirectGuard } from './core/guards/not-found-redirect.guard';
import { ConfiguracionProfile } from './pages/configuracion-profile/configuracion-profile';
import { Calendario } from './pages/calendario/calendario';
import { DatosPersonales } from './pages/datos-personales/datos-personales';
import { Reportes } from './pages/reportes/reportes';
import { AdminRoutes } from './pages/panel-admin/admin-routes';
import { ProfileComponent } from './pages/profile/profile';
import { Notificaciones } from './pages/notificaciones/notificaciones';
import { UsuariosSeguidos } from './pages/usuarios-seguidos/usuarios-seguidos';

export const routes: Routes = [
  // Ruta padre con hijas (protegida)
  { 
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'profile', component: ProfileComponent },          
      { path: 'profile/:username', component: ProfileComponent },
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
            { path: 'usuarios-seguidos', component: UsuariosSeguidos, title: 'Usuarios Seguidos' },
            { path: 'notificaciones', component: Notificaciones, title: 'Notificaciones' },
            { path: 'reportes', component: Reportes, title: 'Reportes' }
        ] },
      { path: 'calendario', component: Calendario, title: 'Calendario' },
      { 
        path: 'mis-eventos', 
        loadComponent: () => import('./pages/mis-eventos/mis-eventos').then(m => m.MisEventosComponent),
        title: 'Mis Eventos' 
      },
    ]
  },

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
    path: 'terminos-y-condiciones',
    loadComponent: () => import('./pages/legal/terminos/terminos.component').then(m => m.TerminosComponent)
  },
  {
    path: 'politica-de-privacidad',
    loadComponent: () => import('./pages/legal/privacidad/privacidad.component').then(m => m.PrivacidadComponent)
  },
  {
    path: 'post-register',
    loadComponent: () => import('./module/auth/register/post-register/post-register.component').then(m => m.PostRegisterComponent)
  },
  {
    path: 'password-recovery',
    loadComponent: () => import('./module/auth/login/password-recovery/password-recovery.component').then(m => m.PasswordRecoveryComponent)
  },
  {
    path: 'new-password/:token',
    loadComponent: () => import('./module/auth/login/new-password/new-password.component').then(m => m.NewPasswordComponent)
  },
      
  
  // Ruta para el panel de administración (protegida)

  { path: 'admin', children: AdminRoutes },
  // Ruta wildcard: redirige según autenticación
  { 
    path: '**', 
    canActivate: [NotFoundRedirectGuard],
    loadComponent: () => import('./core/components/empty/empty.component').then(m => m.EmptyComponent)
  }
];
