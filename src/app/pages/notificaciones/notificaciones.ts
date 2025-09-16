import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Notification {
  id: number;
  type: 'like' | 'follow' | 'comment' | 'event' | 'system';
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  user?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

@Component({
  selector: 'app-notificaciones',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './notificaciones.html',
  styleUrl: './notificaciones.scss'
})
export class Notificaciones implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  activeFilter: 'all' | 'unread' = 'all';
  filteredNotifications: Notification[] = [];

  ngOnInit(): void {
    // Simulate API call delay
    setTimeout(() => {
      this.notifications = [
        {
          id: 1,
          type: 'follow',
          message: 'comenzó a seguirte',
          time: 'Hace 5 minutos',
          read: false,
          user: {
            id: 1,
            name: 'Luna Nova',
            avatar: 'assets/logo/images/artist1.jpg'
          },
          actionUrl: '/profile/1'
        },
        {
          id: 2,
          type: 'like',
          message: 'le gustó tu evento "Festival Sonido Urbano"',
          time: 'Hace 1 hora',
          read: false,
          user: {
            id: 2,
            name: 'Cosmic Waves',
            avatar: 'assets/logo/images/artist2.jpg'
          },
          actionUrl: '/event/1'
        },
        {
          id: 3,
          type: 'comment',
          message: 'comentó en tu evento "Workshop de Producción"',
          time: 'Hace 3 horas',
          read: true,
          user: {
            id: 3,
            name: 'Electric Pulse',
            avatar: 'assets/logo/images/artist3.jpg'
          },
          actionUrl: '/event/3'
        },
        {
          id: 4,
          type: 'event',
          message: 'te invitó al evento "Concierto Acústico"',
          time: 'Hace 1 día',
          read: true,
          user: {
            id: 4,
            name: 'Velvet Sound',
            avatar: 'assets/logo/images/artist4.jpg'
          },
          actionUrl: '/event/2'
        },
        {
          id: 5,
          type: 'system',
          message: 'Tu evento "Festival Sonido Urbano" está programado para mañana',
          time: 'Hace 2 días',
          read: true,
          actionUrl: '/event/1'
        },
        {
          id: 6,
          type: 'follow',
          message: 'comenzó a seguirte',
          time: 'Hace 3 días',
          read: true,
          user: {
            id: 5,
            name: 'Midnight Echo',
            avatar: 'assets/logo/images/artist1.jpg'
          },
          actionUrl: '/profile/5'
        }
      ];
      
      this.applyFilter('all');
      this.loading = false;
    }, 1000);
  }

  applyFilter(filter: 'all' | 'unread'): void {
    this.activeFilter = filter;
    
    if (filter === 'all') {
      this.filteredNotifications = [...this.notifications];
    } else {
      this.filteredNotifications = this.notifications.filter(notification => !notification.read);
    }
  }

  markAsRead(notification: Notification): void {
    if (!notification.read) {
      notification.read = true;
      
      // In a real application, you would call an API to mark as read
      console.log(`Marked notification ${notification.id} as read`);
    }
  }

  markAllAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    
    // In a real application, you would call an API to mark all as read
    this.applyFilter(this.activeFilter);
  }

  getIconForType(type: string): string {
    switch (type) {
      case 'follow': return 'bi-person-plus';
      case 'like': return 'bi-heart';
      case 'comment': return 'bi-chat-dots';
      case 'event': return 'bi-calendar-event';
      case 'system': return 'bi-bell';
      default: return 'bi-bell';
    }
  }

  getNotificationCount(): number {
    return this.notifications.filter(notification => !notification.read).length;
  }
}