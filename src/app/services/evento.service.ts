import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private readonly baseApiUrl = `${environment.apiUrl}/api/eventos`; // Cambia el puerto si tu backend usa otro

  constructor(private http: HttpClient) {}

  crearEvento(evento: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/crear`, evento);
  }

  guardarBorrador(evento: any): Observable<any> {
    return this.http.post(`${this.baseApiUrl}/borrador`, evento);
  }

  getBorradoresPorUsuario(idUsuario: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseApiUrl}/borradores?usuario=${idUsuario}`);
  }

  getEventoPorId(idEvento: string): Observable<any> {
    return this.http.get<any>(`${this.baseApiUrl}/detalle/${idEvento}`);
  }
}
