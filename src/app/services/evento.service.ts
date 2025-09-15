import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private readonly baseApiUrl = 'http://localhost:8080/api/eventos'; // Cambia el puerto si tu backend usa otro

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
