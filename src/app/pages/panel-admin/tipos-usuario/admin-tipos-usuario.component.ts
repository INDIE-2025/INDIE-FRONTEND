import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';
import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';

@Component({
  selector: 'admin-tipos-usuario-page',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent, DataTableComponent],
  template: `
    <admin-layout>
      <app-data-table
        [data]="tiposUsuario"
        [columns]="columns"
        [actions]="actions"
        [filters]="filters"
        [showFilters]="true"
        [showPagination]="false"
        [showAddButton]="true"
        addButtonText="Agregar tipo de usuario"
        searchPlaceholder="Buscar tipo de usuario"
        (actionClicked)="onAction($event)"
        (addClicked)="onAddTipoUsuario()">
      </app-data-table>
    </admin-layout>
  `
})
export class AdminTiposUsuarioPage implements OnInit {
  tiposUsuario = [
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Moderador', 'Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Establecimiento',
      subtipos: ['Establecimiento'],
      cantidadUsuarios: '1000000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Fan',
      subtipos: ['Fan'],
      cantidadUsuarios: '199999',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Artista',
      subtipos: ['Metal', 'Jazz', 'Trap', 'Mostrar más...'],
      cantidadUsuarios: '19999999',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Tipo de usuario 5',
      subtipos: ['Tipo de usuario 5'],
      cantidadUsuarios: '1941932',
      fechaAlta: '14/03/2025',
      estado: 'De baja'
    },
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Moderador', 'Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Moderador', 'Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Moderador', 'Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Moderador', 'Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Moderador', 'Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    }
  ];

  columns: TableColumn[] = [
    { key: 'tipoUsuario', label: 'Tipo de usuario', sortable: true },
    { key: 'subtiposDisplay', label: 'Subtipos de usuario', sortable: false },
    { key: 'cantidadUsuarios', label: 'Cantidad de usuarios', sortable: true },
    { key: 'fechaAlta', label: 'Fecha de alta', sortable: true },
    { key: 'estado', label: 'Estado', type: 'badge', sortable: true },
    { key: 'acciones', label: 'Acciones', type: 'actions' }
  ];

  actions: TableAction[] = [
    { icon: 'fas fa-edit', label: 'Editar', action: 'edit', class: 'action-button edit' },
    { icon: 'fas fa-trash', label: 'Eliminar', action: 'delete', class: 'action-button delete' }
  ];

  filters = [
    {
      key: 'estado',
      placeholder: 'Estado',
      value: '',
      options: [
        { value: 'Activo', label: 'Activo' },
        { value: 'De baja', label: 'De baja' }
      ]
    }
  ];

  ngOnInit() {
    // Procesar los datos para mostrar los subtipos como string
    this.tiposUsuario = this.tiposUsuario.map(tipo => ({
      ...tipo,
      subtiposDisplay: Array.isArray(tipo.subtipos) ? tipo.subtipos.join(', ') : tipo.subtipos
    }));
  }

  onAction(event: {action: string, item: any}) {
    switch(event.action) {
      case 'edit':
        this.editTipoUsuario(event.item);
        break;
      case 'delete':
        this.deleteTipoUsuario(event.item);
        break;
    }
  }

  onAddTipoUsuario() {
    console.log('Agregar nuevo tipo de usuario');
    // Implementar lógica para agregar tipo de usuario
  }

  editTipoUsuario(tipo: any) {
    console.log('Editar tipo de usuario:', tipo);
    // Implementar lógica para editar tipo de usuario
  }

  deleteTipoUsuario(tipo: any) {
    console.log('Eliminar tipo de usuario:', tipo);
    // Implementar lógica para eliminar tipo de usuario
  }
}

