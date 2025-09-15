// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Usuario {
  id: string;
  emailUsuario: string;
  password?: string;
  nombreUsuario?: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario; // si tu login real no devuelve usuario, igual sirve el token
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8080/api/usuario';
  private usuarioActualSubject = new BehaviorSubject<Usuario | null>(null);
  public usuarioActual$ = this.usuarioActualSubject.asObservable();

  constructor(private http: HttpClient) {
    this.verificarSesion();
  }

  /** Trae el usuario según el token (principal del JWT) */
  fetchMe(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/me`);
  }

  /** Si hay token pero no hay usuario en storage, lo pide a /me */
  private verificarSesion(): void {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuarioActual');

    if (!token) return;

    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado) as Usuario;
        this.usuarioActualSubject.next(usuario);
        return;
      } catch {
        this.cerrarSesion();
        return;
      }
    }

    // Hay token pero no hay usuario guardado: lo pedimos al backend
    this.fetchMe().subscribe({
      next: (u) => {
        localStorage.setItem('usuarioActual', JSON.stringify(u));
        this.usuarioActualSubject.next(u);
      },
      error: () => {
        this.cerrarSesion(); // token inválido/expirado
      }
    });
  }

  /** Guardar token y resolver /me; publica el usuario */
  hydrateFromToken(token: string): void {
    localStorage.setItem('token', token);
    this.fetchMe().subscribe({
      next: (u) => {
        localStorage.setItem('usuarioActual', JSON.stringify(u));
        this.usuarioActualSubject.next(u);
      },
      error: () => {
        this.cerrarSesion();
      }
    });
  }

  /** Limpia sesión y notifica */
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioActual');
    this.usuarioActualSubject.next(null);
  }

  /** Acceso observable al usuario actual */
  getUsuarioActual(): Observable<Usuario | null> {
    return this.usuarioActual$;
  }

  /** Helpers útiles para UI */
  estaLogueado(): boolean {
    return this.usuarioActualSubject.value !== null;
  }

  getIdUsuarioActual(): string | null {
    const usuario = this.usuarioActualSubject.value;
    return usuario ? usuario.id : null;
  }

  /** Endpoints que tus páginas usan */
  getPerfilPorId(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  getPerfilPorUsername(username: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/por-username`, { params: { username } });
  }
}
