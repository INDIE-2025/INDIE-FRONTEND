import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from '../../../layout/admin-layout/admin-layout.component';
import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';

@Component({
  selector: 'admin-usuarios-page',
  standalone: true,
  imports: [CommonModule, AdminLayoutComponent, DataTableComponent],
  template: `
    <admin-layout>
      <app-data-table
        [data]="usuarios"
        [columns]="columns"
        [actions]="actions"
        [filters]="filters"
        [showFilters]="true"
        [showPagination]="true"
        [showAddButton]="true"
        addButtonText="Agregar usuario"
        searchPlaceholder="Buscar usuario"
        (actionClicked)="onAction($event)"
        (addClicked)="onAddUser()">
      </app-data-table>
    </admin-layout>
  `
})
export class AdminUsuariosPage implements OnInit {
  usuarios = [
    {
      nombre: 'Tomás Guiñazu',
      nombreUsuario: 'tomas.guinazu',
      email: 'tomasguinazu@gmail.com',
      tipoUsuario: 'Administrador',
      estado: 'Activo'
    },
    {
      nombre: 'María García',
      nombreUsuario: 'mari_garcia40',
      email: 'email@correo.com',
      tipoUsuario: 'Fan',
      estado: 'Activo'
    },
    {
      nombre: 'Carlos Lopez',
      nombreUsuario: 'lopez.carlosss',
      email: 'email@correo.com',
      tipoUsuario: 'Artista',
      estado: 'Activo'
    },
    {
      nombre: 'Carlos Lopez',
      nombreUsuario: 'lopez.carlosss',
      email: 'email@correo.com',
      tipoUsuario: 'Artista',
      estado: 'Activo'
    },
    {
      nombre: 'Carlos Lopez',
      nombreUsuario: 'lopez.carlosss',
      email: 'email@correo.com',
      tipoUsuario: 'Establecimiento',
      estado: 'Activo'
    },
    {
      nombre: 'Carlos Lopez',
      nombreUsuario: 'lopez.carlosss',
      email: 'email@correo.com',
      tipoUsuario: 'Establecimiento',
      estado: 'Activo'
    },
    {
      nombre: 'Carlos Lopez',
      nombreUsuario: 'lopez.carlosss',
      email: 'email@correo.com',
      tipoUsuario: 'Establecimiento',
      estado: 'De baja'
    },
    {
      nombre: 'Carlos Lopez',
      nombreUsuario: 'lopez.carlosss',
      email: 'email@correo.com',
      tipoUsuario: 'Establecimiento',
      estado: 'De baja'
    },
    {
      nombre: 'Carlos Lopez',
      nombreUsuario: 'lopez.carlosss',
      email: 'email@correo.com',
      tipoUsuario: 'Fan',
      estado: 'De baja'
    },
    {
      nombre: 'Carlos Lopez',
      nombreUsuario: 'lopez.carlosss',
      email: 'email@correo.com',
      tipoUsuario: 'Fan',
      estado: 'De baja'
    }
  ];

  columns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre', sortable: true },
    { key: 'nombreUsuario', label: 'Nombre de usuario', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'tipoUsuario', label: 'Tipo de usuario', sortable: true },
    { key: 'estado', label: 'Estado', type: 'badge', sortable: true },
    { key: 'acciones', label: 'Acciones', type: 'actions' }
  ];

  actions: TableAction[] = [
    { icon: 'fas fa-edit', label: 'Editar', action: 'edit', class: 'action-button edit' },
    { icon: 'fas fa-trash', label: 'Eliminar', action: 'delete', class: 'action-button delete' }
  ];

  filters = [
    {
      key: 'tipoUsuario',
      placeholder: 'Tipo de usuario',
      value: '',
      options: [
        { value: 'Administrador', label: 'Administrador' },
        { value: 'Fan', label: 'Fan' },
        { value: 'Artista', label: 'Artista' },
        { value: 'Establecimiento', label: 'Establecimiento' }
      ]
    },
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
    // Inicialización del componente
  }

  onAction(event: {action: string, item: any}) {
    switch(event.action) {
      case 'edit':
        this.editUser(event.item);
        break;
      case 'delete':
        this.deleteUser(event.item);
        break;
    }
  }

  onAddUser() {
    console.log('Agregar nuevo usuario');
    // Implementar lógica para agregar usuario
  }

  editUser(user: any) {
    console.log('Editar usuario:', user);
    // Implementar lógica para editar usuario
  }

  deleteUser(user: any) {
    console.log('Eliminar usuario:', user);
    // Implementar lógica para eliminar usuario
  }
}

