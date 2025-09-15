import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'actions' | 'list';
}

export interface TableAction {
  src?: string;
  label: string;
  action: string;
  isButton?: boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];
  @Input() idKey?: string;
  @Output() actionClicked = new EventEmitter<{action: string, item: any}>();


  private expanded = signal<Set<string|number>>(new Set());
  private maxCollapsed = 4;
  
  isArray(v: any): v is any[] { return Array.isArray(v); }

  getRowKey(row: any, index: number): string | number {
    return this.idKey ? row?.[this.idKey] ?? index : index;
  }

  isExpanded(row: any, index: number): boolean {
  return this.expanded().has(this.getRowKey(row, index));
  }

  toggleExpand(row: any, index: number) {
    const k = this.getRowKey(row, index);
    const next = new Set(this.expanded());
    next.has(k) ? next.delete(k) : next.add(k);
    this.expanded.set(next);
  }

  listItems(row: any, col: TableColumn, rowIndex: number): string[] {
    const arr = Array.isArray(row?.[col.key]) ? row[col.key] : [];
    return this.isExpanded(row, rowIndex) ? arr : arr.slice(0, this.maxCollapsed);
  }

  extraCount(row: any, col: TableColumn): number {
    const arr = Array.isArray(row?.[col.key]) ? row[col.key] : [];
    return Math.max(0, arr.length - this.maxCollapsed);
  }

}