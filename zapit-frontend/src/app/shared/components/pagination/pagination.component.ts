import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 's-app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() page: number = 1;
  @Input() dataLength!: number;
  @Input() dataLimit!: number;
  @Output() pageChanged = new EventEmitter<number>;

  onPageChange(event: any) {
    this.page = Number(event.target.value);
    this.pageChanged.emit(this.page);
  }

  onNextPage() {
    this.pageChanged.emit(++this.page);
  }

  onPreviousPage() {
    this.pageChanged.emit(--this.page);
  }
}
