import { Component, computed, signal } from '@angular/core';

import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';
import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';
import { FiltersComponent, Filter } from '../../../components/filters/filters.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { FormsModule } from '@angular/forms'; 
import { FormInputComponent, FormSelectComponent, FormButtonComponent, FormTextComponent } from "../../../components/form/form-components.component";

@Component({
  selector: 'admin-usuarios-page',
  standalone: true,
  imports: [
    FormsModule,
    SearchBarComponent,
    FiltersComponent,
    DataTableComponent,
    PaginationComponent,
    FormInputComponent,
    FormSelectComponent,
    FormButtonComponent
],
  templateUrl: "./admin-usuarios.component.html",
  styleUrls: ["./admin-usuarios.component.css"]
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
    { key: 'estado', label: 'Estado', type: 'badge', width: '90px' },
    { key: 'acciones', label: 'Acciones', type: 'actions', width: '120px' }
  ];

  actions: TableAction[] = [
  { src: '/assets/icons/edit.svg', label: 'Editar', action: 'edit', isButton: false },
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
        this.onEditUser(event.item);
        break;;
    }
  }

  showAddUserForm = false;

  showEditUserForm = false;

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

  editarUsuario = {
    usuario: '',
    nombre: '',
    email: '',
    tipoUsuario: '',
    subtipoUsuario: '',
    estado: ''
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
  
  guardarNuevoUsuario() {

    const dtoCrearUsuario = {
      usuario: this.nuevoUsuario.usuario,
      nombre: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      tipoUsuario: this.nuevoUsuario.tipoUsuario,
      subtipoUsuario: this.nuevoUsuario.subtipoUsuario,
      password: this.nuevoUsuario.password,
      estado: this.nuevoUsuario.estado
    };

    console.log('Datos a enviar:', dtoCrearUsuario);
    this.showAddUserForm = false; // opcional: cerrar formulario
  }

  onEditUser(user: any) {

    this.editarUsuario.usuario = user.nombreUsuario;
    this.editarUsuario.nombre = user.nombre;
    this.editarUsuario.email = user.email;
    this.editarUsuario.tipoUsuario = user.tipoUsuario;
    this.editarUsuario.subtipoUsuario = '';
    this.editarUsuario.estado = user.estado;

    this.showEditUserForm = true;
    
  }

  guardarUsuario() {

    const dtoEditarUsuario = {
      usuario: this.editarUsuario.usuario,
      nombre: this.editarUsuario.nombre,
      email: this.editarUsuario.email,
      tipoUsuario: this.editarUsuario.tipoUsuario,
      subtipoUsuario: this.editarUsuario.subtipoUsuario,
      estado: this.editarUsuario.estado
    };

    console.log('Datos a enviar:', dtoEditarUsuario);
    this.showEditUserForm = false; // opcional: cerrar formulario
  }

}
