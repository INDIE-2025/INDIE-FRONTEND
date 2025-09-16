import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Usuario {
  id: string;
  emailUsuario: string;
  password?: string; // Solo para registro/login
  nombreUsuario?: string;
  // Agrega aquí otros campos que tenga tu modelo Usuario
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/usuario';
  
  // BehaviorSubject para mantener el estado del usuario logueado
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor(private http: HttpClient) {
    // Al inicializar el servicio, verificar si hay un usuario logueado
    this.verificarSesion();
  }

  // Verificar si hay una sesión activa (por ejemplo, desde localStorage o JWT)
  private verificarSesion(): void {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    
    if (token && usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        this.usuarioActualSubject.next(usuario);
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        this.cerrarSesion();
      }
    }
  }

  // GET /api/usuario - Obtener todos los usuarios (heredado de BaseController)
  getTodosLosUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}`);
  }

  // GET /api/usuario/{id} - Obtener usuario por ID (heredado de BaseController)
  getPerfilPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  // POST /api/usuario - Registrar usuario (heredado de BaseController, usa tu método registrar)
  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}`, usuario);
  }

  // PUT /api/usuario/{id} - Actualizar usuario (heredado de BaseController)
  actualizarUsuario(id: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  // DELETE /api/usuario/{id} - Eliminar usuario (heredado de BaseController)
  eliminarUsuario(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // MÉTODOS DE AUTENTICACIÓN (necesitarás implementar estos endpoints en el backend)

  // Para el login, necesitarás agregar este endpoint en tu UsuarioController
  login(email: string, password: string): Observable<LoginResponse> {
    return new Observable(observer => {
      // Por ahora simulo el login hasta que implementes el endpoint
      // Deberías agregar @PostMapping("/login") en tu controller
      const loginData = { emailUsuario: email, password: password };
      
      // Simulación temporal - reemplazar cuando tengas el endpoint real
      setTimeout(() => {
        const mockResponse: LoginResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          usuario: {
            id: 'usuario-' + Date.now(),
            emailUsuario: email,
            nombreUsuario: 'Usuario Demo'
          }
        };
        
        // Guardar token y usuario en localStorage
        localStorage.setItem('token', mockResponse.token);
        localStorage.setItem('usuarioActual', JSON.stringify(mockResponse.usuario));
        
        // Actualizar el BehaviorSubject
        this.usuarioActualSubject.next(mockResponse.usuario);
        
        observer.next(mockResponse);
        observer.complete();
      }, 1000);
    });
  }

  // Obtener usuario actual (logueado)
  getUsuarioActual(): Observable<Usuario | null> {
    return this.usuarioActual$;
  }

  // Cerrar sesión
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioActual');
    this.usuarioActualSubject.next(null);
  }

  // Verificar si hay un usuario logueado
  estaLogueado(): boolean {
    return this.usuarioActualSubject.value !== null;
  }

  // Obtener ID del usuario actual
  getIdUsuarioActual(): string | null {
    const usuario = this.usuarioActualSubject.value;
    return usuario ? usuario.id : null;
  }
}