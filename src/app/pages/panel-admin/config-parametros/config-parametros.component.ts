import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';
import { FormCheckboxComponent, FormButtonComponent } from '../../../components/form/form-components.component';

interface PermissionConfig {
  name: string;
  administrador: boolean;
  fan: boolean;
  establecimiento: boolean;
  artista: boolean;
}

interface EventConfig {
  name: string;
  nivel: string;
  value: boolean | number;
}

interface NotificationConfig {
  name: string;
  generaNotificacion: boolean;
  notificarPorMail: boolean;
}

interface RecommendationConfig {
  name: string;
  enabled: boolean;
}

interface ReportConfig {
  category: string;
  items: {
    name: string;
    enabled: boolean;
  }[];
}

@Component({
  selector: 'config-parametros-page',
  standalone: true,
  imports: [FormsModule, AdminLayoutComponent, FormCheckboxComponent, FormButtonComponent],
  template: `
    <admin-layout>
      <div class="config-container">
        <!-- Configurar permisos -->
        <section class="config-section">
          <h2 class="section-title">Configurar permisos</h2>
          <div class="permissions-table">
            <div class="table-header">
              <div class="permission-name">Permiso/Funcionalidad</div>
              <div class="role-column">Administrador</div>
              <div class="role-column">Fan</div>
              <div class="role-column">Establecimiento</div>
              <div class="role-column">Artista</div>
            </div>
            @for (permission of permissions; track permission) {
              <div class="table-row">
                <div class="permission-name">{{permission.name}}</div>
                <div class="role-column">
                  <app-form-checkbox
                    [(checked)]="permission.administrador"
                    [disabled]="permission.name === 'Panel de administrador'">
                  </app-form-checkbox>
                </div>
                <div class="role-column">
                  <app-form-checkbox [(checked)]="permission.fan"></app-form-checkbox>
                </div>
                <div class="role-column">
                  <app-form-checkbox [(checked)]="permission.establecimiento"></app-form-checkbox>
                </div>
                <div class="role-column">
                  <app-form-checkbox [(checked)]="permission.artista"></app-form-checkbox>
                </div>
              </div>
            }
          </div>
        </section>
    
        <!-- Configurar eventos -->
        <section class="config-section">
          <h2 class="section-title">Configurar eventos</h2>
          <div class="events-grid">
            <div class="event-config">
              <h3 class="subsection-title">Nivel Tarjeta</h3>
              <div class="config-item">
                <label>Descripción</label>
                <app-form-checkbox [(checked)]="eventConfig.descripcion"></app-form-checkbox>
              </div>
              <div class="config-item">
                <label>Dirección evento</label>
                <app-form-checkbox [(checked)]="eventConfig.direccion"></app-form-checkbox>
              </div>
            </div>
            <div class="event-config">
              <h3 class="subsection-title">Nivel Detalle</h3>
              <div class="config-item">
                <label>Imágenes</label>
                <input type="number" [(ngModel)]="eventConfig.imagenes" class="number-input">
              </div>
              <div class="config-item">
                <label>Mapa</label>
                <app-form-checkbox [(checked)]="eventConfig.mapa"></app-form-checkbox>
              </div>
            </div>
          </div>
        </section>
    
        <!-- Configurar notificaciones -->
        <section class="config-section">
          <h2 class="section-title">Configurar notificaciones</h2>
          <div class="notifications-table">
            <div class="table-header">
              <div class="notification-name">Actividad del sistema</div>
              <div class="notification-column">Genera notificación</div>
              <div class="notification-column">Notificar por mail</div>
            </div>
            @for (notification of notifications; track notification) {
              <div class="table-row">
                <div class="notification-name">{{notification.name}}</div>
                <div class="notification-column">
                  <app-form-checkbox [(checked)]="notification.generaNotificacion"></app-form-checkbox>
                </div>
                <div class="notification-column">
                  <app-form-checkbox [(checked)]="notification.notificarPorMail"></app-form-checkbox>
                </div>
              </div>
            }
          </div>
        </section>
    
        <!-- Configurar recomendaciones -->
        <section class="config-section">
          <h2 class="section-title">Configurar recomendaciones</h2>
          <div class="recommendations-grid">
            <div class="recommendation-group">
              <h3 class="subsection-title">Filtro</h3>
              <div class="config-item">
                <label>Subtipo de usuario</label>
                <app-form-checkbox [(checked)]="recommendations.subtipoUsuario"></app-form-checkbox>
              </div>
            </div>
            <div class="recommendation-group">
              <h3 class="subsection-title">Orden</h3>
              <div class="config-item">
                <label>Eventos Cercanos</label>
                <app-form-checkbox [(checked)]="recommendations.eventosCercanos"></app-form-checkbox>
              </div>
              <div class="config-item">
                <label>Seguidores/Interesados</label>
                <app-form-checkbox [(checked)]="recommendations.seguidoresInteresados"></app-form-checkbox>
              </div>
            </div>
          </div>
        </section>
    
        <!-- Configurar reportes y estadísticas -->
        <section class="config-section">
          <h2 class="section-title">Configurar reportes y estadísticas</h2>
          <div class="reports-grid">
            @for (reportGroup of reportGroups; track reportGroup) {
              <div class="report-group">
                <h3 class="subsection-title">{{reportGroup.category}}</h3>
                @for (item of reportGroup.items; track item) {
                  <div class="config-item">
                    <label>{{item.name}}</label>
                    <app-form-checkbox [(checked)]="item.enabled"></app-form-checkbox>
                  </div>
                }
              </div>
            }
          </div>
        </section>
    
        <!-- Botón guardar -->
        <div class="save-section">
          <app-form-button
            label="Guardar Cambios"
            variant="primary"
            size="large"
            (clicked)="saveChanges()">
          </app-form-button>
        </div>
      </div>
      <admin-layout>
    `,
  styleUrls: ['./config-parametros.component.css']
})
export class ConfigParametrosPage implements OnInit {
  permissions: PermissionConfig[] = [
    { name: 'Panel de administrador', administrador: true, fan: false, establecimiento: false, artista: false },
    { name: 'Visualizar reportes y estadísticas', administrador: true, fan: true, establecimiento: true, artista: true },
    { name: 'Gestionar eventos', administrador: false, fan: true, establecimiento: true, artista: false },
    { name: 'Recibir colaboraciones', administrador: true, fan: true, establecimiento: false, artista: true },
    { name: 'Mensajería', administrador: true, fan: true, establecimiento: true, artista: true },
    { name: 'Perfil público', administrador: true, fan: false, establecimiento: true, artista: true },
    { name: '• Geolocalización', administrador: true, fan: false, establecimiento: true, artista: false },
    { name: '• Calendario', administrador: true, fan: false, establecimiento: true, artista: true },
    { name: '• Contenido digital', administrador: true, fan: false, establecimiento: true, artista: true },
    { name: '• Sección de comentarios', administrador: true, fan: false, establecimiento: true, artista: true }
  ];

  eventConfig = {
    descripcion: true,
    direccion: true,
    imagenes: 5,
    mapa: true
  };

  notifications: NotificationConfig[] = [
    { name: 'Actividad del sistema', generaNotificacion: true, notificarPorMail: false },
    { name: 'Proximidad de eventos', generaNotificacion: false, notificarPorMail: false },
    { name: 'Invitación a colaborar', generaNotificacion: false, notificarPorMail: false },
    { name: 'Colaboración aceptada', generaNotificacion: true, notificarPorMail: false },
    { name: 'Colaboración rechazada', generaNotificacion: true, notificarPorMail: true },
    { name: 'Comentarios', generaNotificacion: true, notificarPorMail: false },
    { name: 'Seguimiento', generaNotificacion: false, notificarPorMail: false },
    { name: 'Interés en evento propio', generaNotificacion: true, notificarPorMail: false },
    { name: 'Comentario denunciado eliminado', generaNotificacion: true, notificarPorMail: true },
    { name: 'Denuncia rechazada', generaNotificacion: true, notificarPorMail: true },
    { name: 'Mensaje nuevo', generaNotificacion: false, notificarPorMail: false }
  ];

  recommendations = {
    subtipoUsuario: true,
    eventosCercanos: false,
    seguidoresInteresados: true
  };

  reportGroups: ReportConfig[] = [
    {
      category: 'Reportes de Usuario',
      items: [
        { name: 'Visualizaciones del perfil', enabled: true },
        { name: 'Usuarios interesados', enabled: true },
        { name: 'Eventos más populares', enabled: true },
        { name: 'Cantidad de seguidores', enabled: true }
      ]
    },
    {
      category: 'Reportes de administrador',
      items: [
        { name: 'Nuevos usuarios en el sistema', enabled: true },
        { name: 'Comentarios realizados en el sistema', enabled: true },
        { name: 'Eventos publicados en el sistema', enabled: false },
        { name: 'Inicios de sesión únicos en el sistema', enabled: true },
        { name: 'Usuarios populares', enabled: true },
        { name: 'Eventos populares', enabled: true }
      ]
    }
  ];

  ngOnInit() {
    // Inicialización del componente
  }

  saveChanges() {
    console.log('Guardando cambios de configuración...');
    console.log('Permisos:', this.permissions);
    console.log('Eventos:', this.eventConfig);
    console.log('Notificaciones:', this.notifications);
    console.log('Recomendaciones:', this.recommendations);
    console.log('Reportes:', this.reportGroups);
    // Implementar lógica para guardar cambios
  }
}

