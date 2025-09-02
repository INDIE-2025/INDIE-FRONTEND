import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';
import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';
import { FiltersComponent, Filter } from '../../../components/filters/filters.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'admin-usuarios-page',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, FiltersComponent, DataTableComponent, PaginationComponent],
  templateUrl: "./admin-usuarios.component.html",
  styleUrl: "./admin-usuarios.component.css"
})
export class AdminUsuariosPage {

  search = signal('');
  page = signal(1);
  pageSize = 10;

  filters = signal<Filter[]>([
    {
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
      placeholder: 'Estado',
      value: '',
      options: [
        { value: 'Activo', label: 'Activo' },
        { value: 'De baja', label: 'De baja' }
      ]
    }
  ]);

  usuarios = signal<any[]>( [
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
    }
  ]);

  columns: TableColumn[] = [
    { key: 'nombre', label: 'Nombre'},
    { key: 'nombreUsuario', label: 'Nombre de usuario'},
    { key: 'email', label: 'Email'},
    { key: 'tipoUsuario', label: 'Tipo de usuario'},
    { key: 'estado', label: 'Estado', type: 'badge'},
    { key: 'acciones', label: 'Acciones', type: 'actions' }
  ];

  actions: TableAction[] = [
    { icon: 'fas fa-edit', label: 'Editar', action: 'edit'},
    { icon: 'fas fa-trash', label: 'Eliminar', action: 'delete'}
  ];

  filteredData = computed(() => {
    const term = this.search().toLowerCase();
    const [tipoUsuarioFilter, estadoFilter] = this.filters();

    return this.usuarios().filter(u => {
      const matchesSearch =
        u.nombre.toLowerCase().includes(term) ||
        u.nombreUsuario.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term);

      const matchesTipo =
        !tipoUsuarioFilter.value || u.tipoUsuario === tipoUsuarioFilter.value;

      const matchesEstado =
        !estadoFilter.value || u.estado === estadoFilter.value;

      return matchesSearch && matchesTipo && matchesEstado;
    });
  });

  totalPages = computed(() =>
    Math.max(1, Math.ceil(this.filteredData().length / this.pageSize))
  );

  paginatedData = computed(() => {
    const start = (this.page() - 1) * this.pageSize;
    return this.filteredData().slice(start, start + this.pageSize);
  });

  onFilters(newFilters: Filter[]) {
    this.filters.set(newFilters);
    this.page.set(1); // resetea página al cambiar filtro
  }

  onSearch(term: string) {
    this.search.set(term);
    this.page.set(1);
  }

  onPage(newPage: number) {
    this.page.set(newPage);
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

