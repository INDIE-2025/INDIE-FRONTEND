import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile';
import {Home} from './pages/home/home';

export const routes: Routes = [
    { path: 'profile', component: ProfileComponent }, // Perfil del usuario actual
    { path: 'profile/:id', component: ProfileComponent }, // Perfil de un usuario específico
    { path: 'home', component: Home },
    { path: '', redirectTo: '/home', pathMatch: 'full' }, // Ruta por defecto
];
