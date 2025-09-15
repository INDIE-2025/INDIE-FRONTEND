import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventoService {
  private apiUrl = 'http://localhost:8080/api/eventos/crear'; // Cambia el puerto si tu backend usa otro

  constructor(private http: HttpClient) {}

  crearEvento(evento: any): Observable<any> {
    return this.http.post(this.apiUrl, evento);
  }

  guardarBorrador(evento: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/eventos/borrador', evento);
  }

  getBorradoresPorUsuario(idUsuario: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/api/eventos/borradores?usuario=${idUsuario}`);
  }

  getEventoPorId(idEvento: string): Observable<any> {
  return this.http.get<any>(`http://localhost:8080/api/eventos/detalle/${idEvento}`);
  }
}
