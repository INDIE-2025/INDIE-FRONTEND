import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface UsuarioBasico {
id: string;
nombreUsuario?: string;
apellidoUsuario?: string;
username?: string;
emailUsuario?: string;
}


export interface VerificacionSeguimiento { sigue: boolean; bloqueado: boolean; }


@Injectable({ providedIn: 'root' })
export class SeguimientoService {
private baseUrl = 'http://localhost:8080/api/seguimiento';


constructor(private http: HttpClient) {}


// Acciones por username
seguir(username: string) { return this.http.post(`${this.baseUrl}/seguir/${username}`, {}); }
dejarDeSeguir(username: string) { return this.http.delete(`${this.baseUrl}/dejarDeSeguir/${username}`); }
bloquear(username: string) { return this.http.post(`${this.baseUrl}/bloquear/${username}`, {}); }
desbloquear(username: string) { return this.http.delete(`${this.baseUrl}/desbloquear/${username}`); }


verificar(username: string): Observable<VerificacionSeguimiento> {
return this.http.get<VerificacionSeguimiento>(`${this.baseUrl}/verificar-seguimiento/${username}`);
}


// Listas + contadores por username
seguidoresDe(username: string): Observable<{ seguidores: UsuarioBasico[]; totalSeguidores: number }> {
return this.http.get<{ seguidores: UsuarioBasico[]; totalSeguidores: number }>(`${this.baseUrl}/seguidores/${username}`);
}


seguidosDe(username: string): Observable<{ seguidos: UsuarioBasico[]; totalSeguidos: number }> {
return this.http.get<{ seguidos: UsuarioBasico[]; totalSeguidos: number }>(`${this.baseUrl}/seguidos/${username}`);
}


estadisticas(username: string): Observable<{ totalSeguidores: number; totalSeguidos: number }> {
return this.http.get<{ totalSeguidores: number; totalSeguidos: number }>(`${this.baseUrl}/estadisticas/${username}`);
}
}