import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventCard } from '../../components/event-card/event-card';
import { MisEventosService, Evento } from '../../services/mis-eventos.service';
import { Dialog } from '@angular/cdk/dialog';
import { PublicarEvento } from '../../components/publicar-evento/publicar-evento';

@Component({
  selector: 'app-mis-eventos',
  standalone: true,
  imports: [CommonModule, RouterModule, EventCard],
  templateUrl: './mis-eventos.html',
  styleUrl: './mis-eventos.scss'
})
export class MisEventosComponent implements OnInit {
  events: Evento[] = [];
  filteredEvents: Evento[] = [];
  activeFilter: 'todos' | 'creados' | 'borradores' | 'publicados' | 'finalizados' = 'todos';
  loading = true;

  constructor(
    private misEventosService: MisEventosService,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }
  
  loadEvents(): void {
    this.loading = true;
    this.misEventosService.getEventosPorUsuario().subscribe({
      next: (eventos) => {
        this.events = eventos;
        this.applyFilter(this.activeFilter);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.loading = false;
      }
    });
  }

  applyFilter(filter: 'todos' | 'creados' | 'borradores' | 'publicados' | 'finalizados'): void {
    this.activeFilter = filter;
    
    if (filter === 'todos') {
      this.filteredEvents = [...this.events];
    } else if (filter === 'creados') {
      this.filteredEvents = this.events.filter(event => event.status === 'creado');
    } else if (filter === 'borradores') {
      this.filteredEvents = this.events.filter(event => event.status === 'borrador');
    } else if (filter === 'publicados') {
      this.filteredEvents = this.events.filter(event => event.status === 'publicado');
    } else if (filter === 'finalizados') {
      this.filteredEvents = this.events.filter(event => event.status === 'finalizado');
    }
  }

  // TrackBy function for better rendering performance
  trackByEventId(index: number, event: Evento): number | string {
    return event.id;
  }

  openCrearEventoModal(): void {
    const dialogRef = this.dialog.open(PublicarEvento, {
      minWidth: '50%',
      maxWidth: '95%',
      data: {}
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        // Reload events if a new one was created
        this.loadEvents();
      }
    });
  }
}