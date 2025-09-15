import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';
import { Filter, FiltersComponent } from '../../../components/filters/filters.component';
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { SearchBarComponent } from "../../../components/search-bar/search-bar.component";

@Component({
  selector: 'admin-tipos-usuario-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent, SearchBarComponent, FiltersComponent],
  templateUrl: "./admin-tipos-usuario.component.html",
  styleUrl: "./admin-tipos-usuario.component.css"
})
export class AdminTiposUsuarioPage {

  search = signal('');
  page = signal(1);
  pageSize = 10;

  filters = signal<Filter[]>([
      {
        placeholder: 'Estado',
        value: '',
        options: [
          { value: 'Activo', label: 'Activo' },
          { value: 'De baja', label: 'De baja' }
        ]
      }
    ]);

  columns: TableColumn[] = [
    { key: 'tipoUsuario', label: 'Tipo de usuario' },
    { key: 'subtipos', label: 'Subtipos de usuario', type: 'list' },
    { key: 'cantidadUsuarios', label: 'Cantidad de usuarios' },
    { key: 'fechaAlta', label: 'Fecha de alta' },
    { key: 'estado', label: 'Estado', type: 'badge' },
    { key: 'acciones', label: 'Acciones', type: 'actions' }
  ];

  actions: TableAction[] = [
  { src: 'assets/icons/edit.svg',    label: 'Editar',  action: 'edit', isButton: false },
  { src: 'assets/icons/cancel.svg',  label: 'Eliminar', action: 'delete', isButton: false }
  ];

    tiposUsuario = signal<any[]>([
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Administrador'],
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
      subtipos: ['Metal', 'Jazz', 'Trap', 'Rap', 'Rock', 'Pop', 'Indie'],
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
      subtipos: ['Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    },
    {
      tipoUsuario: 'Administrador',
      subtipos: ['Administrador'],
      cantidadUsuarios: '100000',
      fechaAlta: '14/03/2025',
      estado: 'Activo'
    }
  ]);


  filteredData = computed(() => {
    const term = this.search().toLowerCase();
    const [estadoFilter] = this.filters();

    return this.tiposUsuario().filter(u => {
      const matchesSearch =
        u.tipoUsuario.toLowerCase().includes(term) ||
        u.subtiposUsuario.subtipoUsuario.toLowerCase().includes(term);

      const matchesEstado =
        !estadoFilter.value || u.estado === estadoFilter.value;

      return matchesSearch && matchesEstado;
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

