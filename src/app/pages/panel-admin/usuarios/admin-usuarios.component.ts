import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';
import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';
import { FiltersComponent, Filter } from '../../../components/filters/filters.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { FormsModule } from '@angular/forms'; 
import { FormInputComponent, FormSelectComponent, FormButtonComponent, FormTextComponent } from "../../../components/form/form-components.component";

@Component({
  selector: 'admin-usuarios-page',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent, FiltersComponent, DataTableComponent, PaginationComponent, FormInputComponent, FormSelectComponent, FormButtonComponent, FormTextComponent],
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
      tipoUsuario: 'Artista',
      estado: 'De baja'
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
  { src: '/assets/icons/edit.svg', label: 'Editar', action: 'edit', isButton: false },
  { src: '/assets/icons/cancel.svg', label: 'Eliminar', action: 'delete', isButton: false }
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
        this.onDeleteUser(event.item);
        break;
    }
  }

  showAddUserForm = false;

  showDeleteUserForm = false;

  nuevoUsuario = {
    usuario: '',
    nombre: '',
    email: '',
    tipoUsuario: '',
    subtipoUsuario: '',
    password: '',
    password2: '',
    estado: 'Activo'
  };

  tiposUsuario = [
    { value: 'Administrador', label: 'Administrador' },
    { value: 'Fan',           label: 'Fan' },
    { value: 'Artista',       label: 'Artista' },
    { value: 'Establecimiento', label: 'Establecimiento' }
  ];

  subtiposUsuario = [{ value: '—', label: '—' }];

  estado = [
    { value: 'Activo', label: 'Activo' },
    { value: 'De baja', label: 'De baja' }
  ];
  
  onAddUser() {

    this.nuevoUsuario = {
      usuario: '',
      nombre: '',
      email: '',
      tipoUsuario: '',
      subtipoUsuario: '',
      password: '',
      password2: '',
      estado: 'Activo'
    };

    this.showAddUserForm = true;

  }

  guardarUsuario() {
  console.log('Datos a enviar:', this.nuevoUsuario);
  // acá llamás a tu servicio para crear el usuario
  // this.usuarioService.crearUsuario(this.nuevoUsuario).subscribe(...)
  this.showAddUserForm = false; // opcional: cerrar formulario
  }

  editUser(user: any) {

    this.nuevoUsuario.usuario = user.nombreUsuario;
    this.nuevoUsuario.nombre = user.nombre;
    this.nuevoUsuario.email = user.email;
    this.nuevoUsuario.tipoUsuario = user.tipoUsuario;
    this.nuevoUsuario.subtipoUsuario = '';
    this.nuevoUsuario.estado = user.estado;

    this.showAddUserForm = true;
    
  }

  onDeleteUser(user: any) {
    this.showDeleteUserForm = true;
  }

  eliminarUsuario() {
    // acá llamás a tu servicio para eliminar el usuario
    // this.usuarioService.eliminarUsuario(userId).subscribe(...)
    this.showDeleteUserForm = false; // opcional: cerrar formulario
  }
}

