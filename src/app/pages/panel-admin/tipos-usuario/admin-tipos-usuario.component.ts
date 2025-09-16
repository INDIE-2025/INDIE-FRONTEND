import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn, TableAction } from '../../../components/data-table/data-table.component';
import { Filter, FiltersComponent } from '../../../components/filters/filters.component';
import { PaginationComponent } from "../../../components/pagination/pagination.component";
import { SearchBarComponent } from "../../../components/search-bar/search-bar.component";
import { FormsModule } from '@angular/forms';
import { FormSubtypesComponent, FormInputComponent, FormButtonComponent, FormSelectComponent, FormTextComponent } from "../../../components/form/form-components.component";
import { AdminUsuariosService } from '../../../services/panel-admin/admin-usuarios.service';

@Component({
  selector: 'admin-tipos-usuario-page',
  standalone: true,
  imports: [CommonModule, DataTableComponent, PaginationComponent, SearchBarComponent, FiltersComponent, FormSubtypesComponent, FormInputComponent, FormButtonComponent, FormsModule, FormSelectComponent],
  templateUrl: "./admin-tipos-usuario.component.html",
  styleUrl: "./admin-tipos-usuario.component.css"
})
export class AdminTiposUsuarioPage implements OnInit {

  private readonly adminUsuariosService = inject(AdminUsuariosService);

  tiposUsuario = signal<any[]>([]);

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
    { key: 'subtipos', label: 'Subtipos de usuario', type: 'list',},
    { key: 'cantidadUsuarios', label: 'Cantidad de usuarios' },
    { key: 'fechaAlta', label: 'Fecha de alta' },
    { key: 'estado', label: 'Estado', type: 'badge', width: '100px' },
    { key: 'acciones', label: 'Acciones', type: 'actions', width: '120px' }
  ];

  actions: TableAction[] = [
    { src: 'assets/icons/edit.svg', label: 'Editar', action: 'edit', isButton: false },
  ];

  ngOnInit(): void {
    this.cargarTiposUsuario();
  }

  private cargarTiposUsuario(): void {
    this.adminUsuariosService.obtenerTiposUsuario().subscribe({
      next: (tipos: any[]) => {
        const normalizados = (tipos ?? []).map((tipo: any) => {
          const nombre = (tipo?.nombreTipoUsuario ?? tipo?.tipoUsuario ?? '').toString();
          const subtipos = Array.isArray(tipo?.subtipos)
            ? tipo.subtipos
                .map((subtipo: any) => {
                  if (typeof subtipo === 'string') {
                    return subtipo;
                  }
                  const nombreSubtipo = subtipo?.nombreSubtipo ?? subtipo?.subtipo ?? '';
                  return nombreSubtipo ? String(nombreSubtipo) : '';
                })
                .filter(Boolean)
            : [];

          return {
            ...tipo,
            nombreTipoUsuario: nombre,
            tipoUsuario: nombre,
            subtipos,
          };
        });

        this.tiposUsuario.set(normalizados);
        this.page.set(1);
      },
      error: (error) => console.error('Error al cargar tipos de usuario', error)
    });
  }

  filteredData = computed(() => {
    const term = this.search().toLowerCase();
    const [estadoFilter] = this.filters();

    return this.tiposUsuario().filter(tipo => {
      const nombreTipo = (tipo?.nombreTipoUsuario ?? tipo?.tipoUsuario ?? '').toString().toLowerCase();
      const subtipos = Array.isArray(tipo?.subtipos)
        ? tipo.subtipos
            .map((subtipo: any) => {
              if (typeof subtipo === 'string') {
                return subtipo;
              }
              const nombreSubtipo = subtipo?.nombreSubtipo ?? subtipo?.subtipo ?? subtipo ?? '';
              return nombreSubtipo ? String(nombreSubtipo) : '';
            })
            .filter(Boolean)
        : [];

      const matchesSearch =
        !term ||
        nombreTipo.includes(term) ||
        subtipos.some((subtipo: string) => subtipo.toLowerCase().includes(term));

      const matchesEstado =
        !estadoFilter.value || tipo.estado === estadoFilter.value;

      return matchesSearch && matchesEstado;
    });
  });
  ;

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
        this.onEditTipoUsuario(event.item);
        break;
    }
  }

  showAddTipoUsuarioForm = false;

  showEditTipoUsuarioForm = false;

  showDeleteTipoUsuarioForm = false;

  nuevoTipoUsuario = {
    nombreTipoUsuario: '',
    subtipos: signal<string[]>([]),
    estado: 'Activo'
  };

  estados = [
    { value: 'Activo', label: 'Activo' },
    { value: 'De baja', label: 'De baja' }
  ];

  onAddTipoUsuario() {

    this.nuevoTipoUsuario = {
      nombreTipoUsuario: '',
      subtipos: signal<string[]>([]),
      estado: 'Activo'
    };

    this.showAddTipoUsuarioForm = true;
  }

  guardarNuevoTipoUsuario() {

    const dtoCrearTipoUsuario = {
      nombreTipoUsuario: this.nuevoTipoUsuario.nombreTipoUsuario,
      subtipos: [...this.nuevoTipoUsuario.subtipos()],
      estado: this.nuevoTipoUsuario.estado,
    };

    this.adminUsuariosService.crearTipoUsuario(dtoCrearTipoUsuario).subscribe({
      next: () => {
        console.log('Guardar nuevo tipo de usuario:', dtoCrearTipoUsuario);
        this.cargarTiposUsuario();
        this.showAddTipoUsuarioForm = false;
      },
      error: (error) => console.error('Error al guardar nuevo tipo de usuario', error)
    });
  }

  onEditTipoUsuario(tipo: any) {
    const subtipos = Array.isArray(tipo?.subtipos) ? tipo.subtipos : [];

    this.nuevoTipoUsuario = {
      nombreTipoUsuario: tipo?.nombreTipoUsuario ?? tipo?.tipoUsuario ?? '',
      subtipos: signal(subtipos),
      estado: tipo?.estado ?? 'Activo'
    };

    this.showEditTipoUsuarioForm = true;
  }

  guardarTipoUsuario() {

    const dtoEditarTipoUsuario = {
      nombreTipoUsuario: this.nuevoTipoUsuario.nombreTipoUsuario,
      subtipos: [...this.nuevoTipoUsuario.subtipos()],
      estado: this.nuevoTipoUsuario.estado,
    };

    this.adminUsuariosService.actualizarTipoUsuario(dtoEditarTipoUsuario.nombreTipoUsuario, dtoEditarTipoUsuario).subscribe({
      next: () => {
        console.log('Guardar tipo de usuario:', dtoEditarTipoUsuario);
        this.cargarTiposUsuario();
        this.showEditTipoUsuarioForm = false;
      },
      error: (error) => console.error('Error al actualizar tipo de usuario', error)
    });
  }
}
