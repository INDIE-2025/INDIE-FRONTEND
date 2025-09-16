import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  prev() { if (this.page > 1) this.pageChange.emit(this.page - 1); }
  next() { if (this.page < this.totalPages) this.pageChange.emit(this.page + 1); }
}