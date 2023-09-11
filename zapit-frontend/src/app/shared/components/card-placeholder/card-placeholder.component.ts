import {Component, Input} from '@angular/core';

@Component({
  selector: 's-app-card-placeholder',
  templateUrl: './card-placeholder.component.html',
  styleUrls: ['./card-placeholder.component.css']
})
export class CardPlaceholderComponent {
  @Input() index!: number;
}
