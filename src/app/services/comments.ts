import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  id: number;
  text: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'http://localhost:8080/api/comments'; 

  constructor(private http: HttpClient) {}

  // Obtener comentarios de un perfil específico
  getCommentsByProfile(profileId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/profile/${profileId}`);
  }

  // Agregar un nuevo comentario
  addComment(profileId: number, text: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/profile/${profileId}`, { text });
  }
}
