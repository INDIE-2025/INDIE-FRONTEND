import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminUsuariosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/admin';

  obtenerTiposUsuario(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/tipos-usuario`);
  }

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios`);
  }

  crearTipoUsuario(dto: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/tipos-usuario`, dto);
  }

  actualizarTipoUsuario(nombreTipoUsuario: string, dto: unknown): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/tipos-usuario/${encodeURIComponent(nombreTipoUsuario)}`, dto);
  }

  crearUsuario(dto: unknown): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/usuarios`, dto);
  }

  actualizarUsuario(email: string, dto: unknown): Observable<unknown> {
    return this.http.put(`${this.baseUrl}/usuarios/${encodeURIComponent(email)}`, dto);
  }
}
