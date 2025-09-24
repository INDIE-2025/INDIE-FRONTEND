import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';


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
private baseUrl = `${environment.apiUrl}/api/seguimiento`;


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

// Obtener lista de usuarios bloqueados
usuariosBloqueados(): Observable<{ usuariosBloqueados: UsuarioBasico[]; totalBloqueados: number }> {
const url = `${this.baseUrl}/bloqueados`;
return this.http.get<{ usuariosBloqueados: UsuarioBasico[]; totalBloqueados: number }>(url).pipe(
  timeout(10000), // 10 segundos de timeout
  catchError(error => {
    // Si el endpoint no existe o hay error, retornar lista vacía
    if (error.status === 404) {
      return of({ usuariosBloqueados: [], totalBloqueados: 0 });
    } else if (error.status === 0) {
      // Error de red o CORS - servidor no disponible
    } else if (error.name === 'TimeoutError') {
      // Timeout - el servidor tardó más de 10 segundos en responder
    }
    
    throw error;
  })
);
}

// MÉTODO SIMPLIFICADO: Ya no necesario porque el backend maneja la verificación automáticamente
// El método verificar() ya devuelve la información de bloqueo necesaria
// Los endpoints de perfil y estadísticas devuelven 403 automáticamente si hay bloqueo

}
