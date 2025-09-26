import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ChatSummaryDto, MensajeDto } from '../models/chat.models';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ChatApiService {
  private baseUrl = `${environment.apiUrl}/api/chat`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    return headers;
  }

  getOrCreateDirectChat(otherUserId: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.baseUrl}/with/${otherUserId}`, {}, { headers: this.authHeaders() });
  }

  listMyChats(): Observable<ChatSummaryDto[]> {
    return this.http.get<ChatSummaryDto[]>(`${this.baseUrl}/mine`, { headers: this.authHeaders() });
  }

  listMessages(chatId: string, page = 0, size = 20): Observable<any /* Page<MensajeDto> */> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(`${this.baseUrl}/${chatId}/messages`, { headers: this.authHeaders(), params });
  }

  sendMessage(chatId: string, mensaje: string): Observable<MensajeDto> {
    return this.http.post<MensajeDto>(`${this.baseUrl}/${chatId}/messages`, { mensaje }, { headers: this.authHeaders() });
  }

  markAsRead(chatId: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${chatId}/read`, {}, { headers: this.authHeaders() });
  }

  getParticipants(chatId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${chatId}/participants`, { headers: this.authHeaders() });
  }
}

