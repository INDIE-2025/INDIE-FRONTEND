import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  // For development purposes - change to false in production
  private bypassAuthForDevelopment = false; // ← CAMBIAR A FALSE
  
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    // For development, you can bypass authentication
    if (this.bypassAuthForDevelopment) {
      // Add a mock token for development
      if (!localStorage.getItem('token')) {
        localStorage.setItem('token', 'dev-mock-token');
      }
      return true;
    }
    
    // Normal authentication check
    if (this.auth.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}