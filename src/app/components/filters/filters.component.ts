import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  value: string;
  label: string;
}

export interface Filter {
  placeholder: string;
  value: string;
  options: FilterOption[];
}

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./filters.component.html",
  styleUrl: "./filters.component.css"
})
export class FiltersComponent {
  @Input() filters: Filter[] = [];
  @Output() filtersChange = new EventEmitter<Filter[]>();
  onChange() {
    // Emití un NUEVO array para facilitar la detección de cambios en el padre
    this.filtersChange.emit(this.filters.map(f => ({ ...f })));
  }
}