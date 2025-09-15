import { Component, OnInit } from '@angular/core';

import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';

@Component({
  selector: 'admin-reportes-page',
  standalone: true,
  imports: [AdminLayoutComponent],
  template: `
    <admin-layout>
      <div class="reportes-container">
        <div class="reportes-placeholder">
          <h2>Reportes</h2>
          <p>Esta sección está en desarrollo.</p>
          <p>Aquí se mostrarán los reportes y estadísticas del sistema.</p>
        </div>
      </div>
    </admin-layout>
  `,
  styles: [`
    .reportes-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 400px;
    }
    
    .reportes-placeholder {
      text-align: center;
      background: #2a2d47;
      padding: 40px;
      border-radius: 8px;
      color: #ffffff;
    }
    
    .reportes-placeholder h2 {
      font-size: 24px;
      margin-bottom: 16px;
      color: #c084fc;
    }
    
    .reportes-placeholder p {
      font-size: 16px;
      color: #8b8fa3;
      margin-bottom: 8px;
    }
  `]
})
export class ReportesPage implements OnInit {
  ngOnInit() {
    // Inicialización del componente
    console.log('Componente de Reportes cargado');
  }
}

