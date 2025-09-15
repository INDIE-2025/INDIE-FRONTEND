import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Evento {
  id: number | string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  creator: string;
  collaborator: string;
  interested: number;
  description: string;
  status: 'creado' | 'borrador' | 'publicado' | 'finalizado';
}

@Injectable({
  providedIn: 'root'
})
export class MisEventosService {
  private readonly baseApiUrl = 'http://localhost:8080/api/eventos';

  constructor(private http: HttpClient) {}

  // Get all events for the current user
  getEventosPorUsuario(): Observable<Evento[]> {
    // This would call the API endpoint to get events for the current user
    // return this.http.get<Evento[]>(`${this.baseApiUrl}/mis-eventos`);
    
    // For now, we'll return mock data
    return of(this.getMockEventos());
  }

  // Filter events by status
  getEventosPorStatus(status: string): Observable<Evento[]> {
    // This would call the API endpoint to get events for the current user with specific status
    // return this.http.get<Evento[]>(`${this.baseApiUrl}/mis-eventos?status=${status}`);
    
    // For now, we'll return filtered mock data
    if (status === 'todos') {
      return of(this.getMockEventos());
    } else {
      return of(this.getMockEventos().filter(evento => evento.status === status));
    }
  }

  // Mock data for testing
  private getMockEventos(): Evento[] {
    return [
      {
        id: 1,
        title: 'Festival Sonido Urbano',
        date: '15 JUN',
        time: '21:00 hs',
        location: 'Av. Siempre Viva',
        image: 'assets/logo/images/event1.jpg',
        creator: 'Oracle',
        collaborator: 'Juan',
        interested: 1209,
        description: 'Lorem non ut ipsum sit dolus voluptat quis que ornat, consectetur dignissim, felis Lorem et ipsum non.',
        status: 'publicado'
      },
      {
        id: 2,
        title: 'Concierto Acústico',
        date: '20 JUN',
        time: '19:30 hs',
        location: 'Teatro Central',
        image: 'assets/logo/images/event2.jpg',
        creator: 'Oracle',
        collaborator: 'Maria',
        interested: 850,
        description: 'Una noche íntima de música acústica con artistas locales y invitados especiales.',
        status: 'borrador'
      },
      {
        id: 3,
        title: 'Workshop de Producción Musical',
        date: '25 JUN',
        time: '15:00 hs',
        location: 'Estudio Indie',
        image: 'assets/logo/images/event3.jpg',
        creator: 'Oracle',
        collaborator: 'Carlos',
        interested: 540,
        description: 'Aprende técnicas avanzadas de producción musical con profesionales de la industria.',
        status: 'creado'
      },
      {
        id: 4,
        title: 'Indie Festival 2023',
        date: '10 MAY',
        time: '18:00 hs',
        location: 'Parque Central',
        image: 'assets/logo/images/event1.jpg',
        creator: 'Oracle',
        collaborator: 'Laura',
        interested: 2500,
        description: 'El festival anual que reúne a los mejores artistas independientes de la escena local.',
        status: 'finalizado'
      }
    ];
  }
}