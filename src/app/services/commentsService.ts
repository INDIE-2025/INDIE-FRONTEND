import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ComentarioDTO {
  comentario: string;
  usuarioComentador: string;
  usuarioComentado: string;
  fecha: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'http://localhost:8080/api/comentario'; 

  constructor(private http: HttpClient) {}

 
  traerComentariosDeUnUsuario(idUsuarioComentado: string): Observable<ComentarioDTO[]> {
    const url = `${this.apiUrl}/traercomentarios?idUsuarioComentado=${idUsuarioComentado}`;
    return this.http.get<ComentarioDTO[]>(url);
  }


  realizarComentario(comentario: string, idUsuarioComentador: string, idUsuarioComentado: string): Observable<ComentarioDTO> {
  const url = `${this.apiUrl}/realizarComentario?comentario=${encodeURIComponent(comentario)}&idUsuarioComentador=${idUsuarioComentador}&idUsuarioComentado=${idUsuarioComentado}`;
  return this.http.post<ComentarioDTO>(url, {});
  } 

}
