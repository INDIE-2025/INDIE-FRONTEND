import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EventStats {
  month: string;
  published: number;
  attended: number;
}

interface SocialStat {
  title: string;
  count: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss'
})
export class Reportes implements OnInit {
  // Estadísticas sociales
  socialStats: SocialStat[] = [
    { title: 'Eventos', count: 12, icon: 'bi-calendar-event', color: 'purple' },
    { title: 'Seguidores', count: 248, icon: 'bi-people', color: 'primary' },
    { title: 'Siguiendo', count: 54, icon: 'bi-person-plus', color: 'purple-light' },
    { title: 'Comentarios', count: 97, icon: 'bi-chat-dots', color: 'primary-light' }
  ];

  // Datos para el gráfico de eventos
  eventData: EventStats[] = [
    { month: 'Ene', published: 2, attended: 1 },
    { month: 'Feb', published: 1, attended: 1 },
    { month: 'Mar', published: 3, attended: 2 },
    { month: 'Abr', published: 2, attended: 1 },
    { month: 'May', published: 4, attended: 3 },
    { month: 'Jun', published: 2, attended: 2 },
  ];

  // Datos para géneros favoritos
  favoriteGenres: {name: string, percentage: number}[] = [
    { name: 'Electrónica', percentage: 40 },
    { name: 'Hip Hop', percentage: 25 },
    { name: 'Rock', percentage: 20 },
    { name: 'Pop', percentage: 15 }
  ];

  // Actividad reciente
  recentActivity: {action: string, date: string}[] = [
    { action: 'Asististe al evento "Festival Underground"', date: 'Hace 2 días' },
    { action: 'Publicaste el evento "Workshop de Producción"', date: 'Hace 5 días' },
    { action: 'Seguiste a 3 nuevos artistas', date: 'Hace 1 semana' },
    { action: 'Comentaste en 2 eventos', date: 'Hace 2 semanas' }
  ];

  ngOnInit(): void {
    // Aquí podríamos cargar datos desde una API
    // this.loadReportData();
  }

  // Método para cargar datos de reportes (en una implementación real)
  // private loadReportData(): void {
  //   this.reportService.getUserStats().subscribe(data => {
  //     this.socialStats = data.socialStats;
  //     this.eventData = data.eventData;
  //     // etc.
  //   });
  // }
}
