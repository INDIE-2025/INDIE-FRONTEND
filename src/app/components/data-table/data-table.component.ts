import { Component, Input, Output, EventEmitter, OnInit, inject, Signal, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'actions';
}

export interface TableAction {
  icon: string;
  label: string;
  action: string;
  class?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  // Ahora puede recibir un array normal o un signal
  private _dataSignal?: Signal<any[]> = signal([]);

  @Input()
  set data(value: any[] | Signal<any[]>) {
    if (typeof (value as Signal<any[]>) === 'function') {
      // Si es un signal, lo guardamos y creamos un efecto para actualizar filteredData
      this._dataSignal = value as Signal<any[]>;
      effect(() => {
        this.applyFilters(this._dataSignal!());
      });
    } else {
      // Si es un array normal, solo aplicamos filtros
      this.applyFilters(value as any[]);
    }
  }

  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() filters: any[] = [];
  @Input() showFilters: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() showAddButton: boolean = false;
  @Input() addButtonText: string = 'Agregar';
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() pageSize: number = 10;

  @Output() actionClicked = new EventEmitter<{ action: string; item: any }>();
  @Output() addClicked = new EventEmitter<void>();

  filteredData: any[] = [];
  paginatedData: any[] = [];
  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage: number = 1;
  totalPages: number = 1;

  constructor() {
    // Creamos el effect en el constructor, que sí es un contexto de inyección
    effect(() => {
      this.applyFilters(this._dataSignal!());
    });
  }

  ngOnInit() {
    // Nada que hacer aquí, los signals se manejan vía effect
  }

  onSearch() {
    this.applyFilters(this._dataSignal ? this._dataSignal() : this.filteredData);
  }

  onFilter() {
    this.applyFilters(this._dataSignal ? this._dataSignal() : this.filteredData);
  }

  onSort(column: TableColumn) {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.applyFilters(this._dataSignal ? this._dataSignal() : this.filteredData);
  }

  onAction(action: string, item: any) {
    this.actionClicked.emit({ action, item });
  }

  onAdd() {
    this.addClicked.emit();
  }

  private applyFilters(data: any[]) {
    let filtered = [...data];

    // Aplicar búsqueda
    if (this.searchTerm) {
      filtered = filtered.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }

    // Aplicar filtros
    this.filters.forEach(filter => {
      if (filter.value) {
        filtered = filtered.filter(item => item[filter.key] === filter.value);
      }
    });

    // Aplicar ordenamiento
    if (this.sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[this.sortColumn];
        const bVal = b[this.sortColumn];
        const modifier = this.sortDirection === 'asc' ? 1 : -1;

        if (aVal < bVal) return -1 * modifier;
        if (aVal > bVal) return 1 * modifier;
        return 0;
      });
    }

    this.filteredData = filtered;
    this.currentPage = 1;
    this.updatePagination();
  }

  private updatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  goToPage(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  getPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (this.currentPage > 3) pages.push('...');

      const start = Math.max(2, this.currentPage - 1);
      const end = Math.min(this.totalPages - 1, this.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (this.currentPage < this.totalPages - 2) pages.push('...');
      pages.push(this.totalPages);
    }

    return pages;
  }

  getBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Activo': 'badge-active',
      'De baja': 'badge-inactive',
      'Fallido': 'badge-error',
      'Exitoso': 'badge-success',
      'En Progreso': 'badge-progress'
    };
    return statusClasses[status] || 'badge-default';
  }
}
