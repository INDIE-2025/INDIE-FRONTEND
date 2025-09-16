
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';
import { SearchBarComponent } from '../../../components/search-bar/search-bar.component';
import { FiltersComponent, Filter } from '../../../components/filters/filters.component';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { FormsModule } from '@angular/forms'; 
import { FormInputComponent, FormSelectComponent, FormButtonComponent, FormTextComponent } from "../../../components/form/form-components.component";
import { AdminUsuariosService } from '../../../services/panel-admin/admin-usuarios.service';

interface SelectOption { value: string; label: string; }
interface TipoUsuarioCatalogo extends SelectOption { subtipos: SelectOption[]; }


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
export class AdminUsuariosPage implements OnInit {

  private readonly adminUsuariosService = inject(AdminUsuariosService);

  private readonly tiposUsuarioCatalogo = signal<TipoUsuarioCatalogo[]>([]);
  tiposUsuario = computed<SelectOption[]>(() => this.tiposUsuarioCatalogo().map(({ value, label }) => ({ value, label })));
  subtiposNuevoUsuario = signal<SelectOption[]>([]);
  subtiposEditarUsuario = signal<SelectOption[]>([]);


  usuarios = signal<any[]>([]);

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


  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarTiposUsuario();
  }

  private cargarUsuarios(): void {
    this.adminUsuariosService.obtenerUsuarios().subscribe({
      next: (usuarios: any[]) => {
        this.usuarios.set(usuarios ?? []);
        this.page.set(1);
      },
      error: (error) => console.error('Error al cargar usuarios', error)
    });
  }

  private cargarTiposUsuario(): void {
    this.adminUsuariosService.obtenerTiposUsuario().subscribe({
      next: (tipos: any[]) => {
        const catalogo = (tipos ?? []).map((tipo: any) => {
          const nombre = (tipo?.nombreTipoUsuario ?? tipo?.tipoUsuario ?? '').toString();
          const subtipos = Array.isArray(tipo?.subtipos) ? tipo.subtipos : [];
          return {
            value: nombre,
            label: nombre,
            subtipos: subtipos.map((subtipo: any) => ({ value: String(subtipo), label: String(subtipo) })),
          } as TipoUsuarioCatalogo;
        });

        this.tiposUsuarioCatalogo.set(catalogo);

        const [tipoFilter, estadoFilter] = this.filters();
        const updatedTipoOptions = catalogo.map(({ value, label }) => ({ value, label }));
        const selectedTipo = tipoFilter?.value ?? '';
        const tipoValue = updatedTipoOptions.some(option => option.value === selectedTipo) ? selectedTipo : '';

        const tipoFilterActual = tipoFilter ?? { placeholder: 'Tipo de usuario', value: '', options: [] };
        const estadoFilterActual = estadoFilter ?? { placeholder: 'Estado', value: '', options: this.estado };

        this.filters.set([
          { ...tipoFilterActual, value: tipoValue, options: updatedTipoOptions },
          { ...estadoFilterActual },
        ]);

        this.actualizarSubtiposPorTipo(this.nuevoUsuario.tipoUsuario, 'nuevo');
        this.actualizarSubtiposPorTipo(this.editarUsuario.tipoUsuario, 'editar');
      },
      error: (error) => console.error('Error al cargar tipos de usuario', error)
    });
  }

  filteredData = computed(() => {
    const term = this.search().toLowerCase();
    const [tipoUsuarioFilter, estadoFilter] = this.filters();

    return this.usuarios().filter(u => {
      const matchesSearch =
        (u.nombre ?? '').toLowerCase().includes(term) ||
        (u.nombreUsuario ?? '').toLowerCase().includes(term) ||
        (u.email ?? '').toLowerCase().includes(term);

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
    this.page.set(1); // resetea pagina al cambiar filtro
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
        break;
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



  estado = [
    { value: 'Activo', label: 'Activo' },
    { value: 'De baja', label: 'De baja' }
  ];
  

  private actualizarSubtiposPorTipo(tipo: string, contexto: 'nuevo' | 'editar'): void {
    const catalogo = this.tiposUsuarioCatalogo().find(opcion => opcion.value === tipo);
    const opciones = catalogo ? catalogo.subtipos.map(subtipo => ({ ...subtipo })) : [];
    if (contexto === 'nuevo') {
      this.subtiposNuevoUsuario.set(opciones);
      if (!opciones.some(opt => opt.value === this.nuevoUsuario.subtipoUsuario)) {
        this.nuevoUsuario.subtipoUsuario = '';
      }
    } else {
      this.subtiposEditarUsuario.set(opciones);
      if (!opciones.some(opt => opt.value === this.editarUsuario.subtipoUsuario)) {
        this.editarUsuario.subtipoUsuario = '';
      }
    }
  }

  onTipoUsuarioChangeNuevo(tipo: string): void {
    this.nuevoUsuario.tipoUsuario = tipo;
    this.actualizarSubtiposPorTipo(tipo, 'nuevo');
  }

  onTipoUsuarioChangeEditar(tipo: string): void {
    this.editarUsuario.tipoUsuario = tipo;
    this.actualizarSubtiposPorTipo(tipo, 'editar');
  }

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

    this.actualizarSubtiposPorTipo(this.nuevoUsuario.tipoUsuario, 'nuevo');
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

    this.adminUsuariosService.crearUsuario(dtoCrearUsuario).subscribe({
      next: () => {
        console.log('Datos a enviar:', dtoCrearUsuario);
        this.cargarUsuarios();
        this.showAddUserForm = false; // opcional: cerrar formulario
      },
      error: (error) => console.error('Error al crear usuario', error)
    });
  }

  onEditUser(user: any) {

    this.editarUsuario.usuario = user.nombreUsuario;
    this.editarUsuario.nombre = user.nombre;
    this.editarUsuario.email = user.email;
    this.editarUsuario.tipoUsuario = user.tipoUsuario;
    this.editarUsuario.subtipoUsuario = user.subtipoUsuario ?? '';
    this.editarUsuario.estado = user.estado;

    this.actualizarSubtiposPorTipo(this.editarUsuario.tipoUsuario, 'editar');

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

    this.adminUsuariosService.actualizarUsuario(dtoEditarUsuario.email, dtoEditarUsuario).subscribe({
      next: () => {
        console.log('Datos a enviar:', dtoEditarUsuario);
        this.cargarUsuarios();
        this.showEditUserForm = false; // opcional: cerrar formulario
      },
      error: (error) => console.error('Error al actualizar usuario', error)
    });
  }

}





