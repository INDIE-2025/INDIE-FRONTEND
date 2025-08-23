import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile';
import {Home} from './pages/home/home';

export const routes: Routes = [
    { path: 'profile', component: ProfileComponent },
    { path: 'home', component: Home },
];
