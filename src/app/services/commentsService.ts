import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ComentarioDTO {
  idComentario?: string;              
  comentario: string;
  nombreAutorComentario: string;
  createdAt: string;
  idUsuarioComentador: string;
}

@Injectable({ providedIn: 'root' })
export class CommentsService {

  private apiUrl = 'http://localhost:8080/api/comentario';

 
  constructor(private http: HttpClient) {}


  traerComentariosDeUnUsuario(idUsuarioComentado: string): Observable<ComentarioDTO[]> {
    const url = `${this.apiUrl}/traercomentarios?idUsuarioComentado=${encodeURIComponent(idUsuarioComentado)}`;
    return this.http.get<ComentarioDTO[]>(url);
  }

  realizarComentario(comentario: string, idUsuarioComentador: string, idUsuarioComentado: string): Observable<ComentarioDTO> {
    const url = `${this.apiUrl}/realizarComentario?comentario=${encodeURIComponent(comentario)}&idUsuarioComentador=${encodeURIComponent(idUsuarioComentador)}&idUsuarioComentado=${encodeURIComponent(idUsuarioComentado)}`;
    return this.http.post<ComentarioDTO>(url, {});
  }


  eliminarComentario(idComentario: string, idUsuario: string): Observable<{ message: string }> {
    const url = `${this.apiUrl}/eliminar?idComentario=${encodeURIComponent(idComentario)}&idUsuario=${encodeURIComponent(idUsuario)}`;
    return this.http.delete<{ message: string }>(url);
  }


  denunciarComentario(idComentario: string, idUsuario: string, motivoDenuncia: string): Observable<{ message: string }> {
    const url = `${this.apiUrl}/denunciar?idComentario=${encodeURIComponent(idComentario)}&idUsuario=${encodeURIComponent(idUsuario)}&motivoDenuncia=${encodeURIComponent(motivoDenuncia)}`;
    return this.http.post<{ message: string }>(url, {});
  }
}
