import { Component, inject, OnInit, signal } from '@angular/core';

import { DataTableComponent, TableColumn } from '../../../components/data-table/data-table.component';
import { FormButtonComponent } from '../../../components/form/form-components.component';
import { HistorialOperacionesService, Operacion } from '../../../services/panel-admin/historial-operaciones.service';

@Component({
  selector: 'backup-recuperacion-page',
  standalone: true,
  imports: [DataTableComponent, FormButtonComponent],
  templateUrl: './backup-recuperacion.component.html',
  styleUrls: ['./backup-recuperacion.component.css']
})
export class BackupRecuperacionPage implements OnInit {

  private historialOperacionesService = inject(HistorialOperacionesService);

  operaciones = signal<Operacion[]>([]);

  constructor() {
    this.historialOperacionesService.getActividadReciente().subscribe({
      next: (data) => this.operaciones.set(data),
      error: (err) => console.error('Error cargando actividad', err),
    });
  }

  operacionesColumns: TableColumn[] = [
    { key: 'nombreOperacion', label: 'Nombre' },
    { key: 'tipo', label: 'Tipo de operación' },
    { key: 'fechaRefactorizada', label: 'Fecha y hora' },
    { key: 'username', label: 'Iniciado por' },
    { key: 'estado', label: 'Estado', type: 'badge' }
  ];

  ngOnInit() {
    // Inicialización del componente
  }

  realizarBackupManual() {
    console.log('Iniciando backup manual...');
    // Implementar lógica para backup manual
    // Mostrar modal de confirmación o progreso
  }

  realizarRecuperacion() {
    console.log('Iniciando recuperación...');
    // Implementar lógica para recuperación
    // Mostrar modal de selección de archivo o confirmación
  }

  irPanelAWS() {
    console.log('Redirigiendo al panel de AWS...');
    // Implementar redirección al panel de AWS
    window.open('https://aws.amazon.com/console/', '_blank');
  }
}

