import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';


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
    ]
  },
  
  // Ruta wildcard
  { path: '**', redirectTo: '/login' }
];
