import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, delay, catchError } from 'rxjs/operators';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SubTipoUsuario } from '../models/subTipoUsuario.model';
import { environment } from '../../../environments/environment';

interface DecodedToken {
  sub: string; // email del usuario
  id: string;  // id del usuario
  nombre: string;
  apellido: string;
  exp: number;
}

interface UserDetails {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private jwtHelper = new JwtHelperService();
  private currentUserSubject = new BehaviorSubject<UserDetails | null>(this.getUserFromToken());
  
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar token al iniciar servicio
    if (this.getToken()) {
      this.updateUserDetails();
    }
  }

  login(data: { emailUsuario: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        console.log('Respuesta de login:', response);
        
        // Guardar el token
        localStorage.setItem('token', response.token);
        
        // Intentar actualizar los detalles del usuario
        this.updateUserDetails();
        
        // Verificar si tenemos el ID del usuario
        const userId = this.getCurrentUserId();
        console.log('ID de usuario después de login:', userId);
      })
    );
  }
  
  private getUserFromToken(): UserDetails | null {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log('Token decodificado:', decodedToken);
      
      // Verificar si el token ha expirado
      const isExpired = this.jwtHelper.isTokenExpired(token);
      console.log('¿Token expirado?', isExpired);
      
      if (isExpired) {
        this.logout();
        return null;
      }
      
      // Verificar estructura del token para extraer datos correctamente
      // Los campos pueden variar según cómo se generó el token en el backend
      const id = decodedToken.id || decodedToken.userId || decodedToken.sub;
      const email = decodedToken.email || decodedToken.sub;
      const nombre = decodedToken.nombre || decodedToken.name || '';
      const apellido = decodedToken.apellido || decodedToken.lastName || '';
      
      console.log('Datos extraídos del token:', { id, email, nombre, apellido });
      
      if (!id) {
        console.warn('No se pudo extraer ID del usuario del token');
        return null;
      }
      
      return { id, email, nombre, apellido };
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }
  
  private updateUserDetails(): void {
    const userDetails = this.getUserFromToken();
    this.currentUserSubject.next(userDetails);
  }

  register(data: { nombreUsuario: string; emailUsuario: string; password: string }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
  
  getCurrentUser(): UserDetails | null {
    return this.currentUserSubject.value;
  }
  
  getCurrentUserId(): string | null {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  }

  requestPasswordReset(email: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/request-password-reset`, { email }, { responseType: 'text' as const });
  }

  validateResetToken(token: string): Observable<{ valid: boolean }> {
    return this.http.get<{ valid: boolean }>(`${this.apiUrl}/validate-reset-token?token=${token}`);
  }

  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, { 
      token, 
      newPassword 
    });
  }

  getSubTipoUsuario(): Observable<SubTipoUsuario[]> {
  return this.http.get<SubTipoUsuario[]>(`${this.apiUrl}/sub-tipo-todos`);
}


}
