import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface ComentarioDTO {
  idComentario?: string;              
  comentario: string;
  nombreAutorComentario: string;
  createdAt: string;
  idUsuarioComentador: string;
}

@Injectable({ providedIn: 'root' })
export class CommentsService {
  private apiUrl = `${environment.apiUrl}/api/comentario`;
  constructor(private http: HttpClient) {}

  traerComentariosDeUnUsuario(idUsuarioComentado: string): Observable<ComentarioDTO[]> {
    return this.http.get<ComentarioDTO[]>(`${this.apiUrl}/traercomentarios`, {
      params: { idUsuarioComentado }
    });
  }

  
  realizarComentario(comentario: string, idUsuarioComentado: string): Observable<ComentarioDTO> {
    return this.http.post<ComentarioDTO>(`${this.apiUrl}/realizarComentario`, null, {
      params: { comentario, idUsuarioComentado }
    });
  }

  
  eliminarComentario(idComentario: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/eliminar`, {
      params: { idComentario }
    });
  }

  
  denunciarComentario(idComentario: string, motivoDenuncia: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/denunciar`, null, {
      params: { idComentario, motivoDenuncia }
    });
  }
}
