// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Usuario } from '../core/models/usuario.model';


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
  private async verificarSesion(): Promise<void> {
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
    await this.setMe();
  }

  async setMe(): Promise<void> {
    const u = await this.fetchMe().toPromise();
    if (u) {
      localStorage.setItem('usuarioActual', JSON.stringify(u));
      this.usuarioActualSubject.next(u);
    }
  }

  /** Guardar token y resolver /me; publica el usuario */
  async hydrateFromToken(token: string): Promise<void> {
    localStorage.setItem('token', token);
    await this.setMe();
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

  updatePerfil(email: string, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/update-me`, { email, ...usuario });
  }

  changePassword(email: string, passwordData: { currentPassword: string; newPassword: string }): Observable<string> {
    return this.http.post(`${this.apiUrl}/change-password`, { email, ...passwordData }, { responseType: 'text' as const });
  }

}
