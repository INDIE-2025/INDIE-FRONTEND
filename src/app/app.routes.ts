import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AdminRoutes } from './pages/panel-admin/admin-routes';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'admin', children: AdminRoutes },
    { path: '**', redirectTo: '' },

];
