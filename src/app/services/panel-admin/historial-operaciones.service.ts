import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Operacion {
  nombreOperacion: string;
  fechaRefactorizada: string;
  username: string;
  tipo: string;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class HistorialOperacionesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api/admin`;

  getActividadReciente(): Observable<Operacion[]> {
    return this.http.get<Operacion[]>(`${this.baseUrl}/operacionesbd/obtener_operaciones`);
  }
}
