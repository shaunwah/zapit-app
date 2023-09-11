import {Component, Input} from '@angular/core';
import {Card} from "../../../card/card";

@Component({
  selector: 's-app-card-list-group',
  templateUrl: './card-list-group.component.html',
  styleUrls: ['./card-list-group.component.css']
})
export class CardListGroupComponent {
  @Input() cards!: Card[];

  stringToColour(input: string, hover: boolean = false) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = (hash & 0xff) % 200 + 55;
    const g = ((hash >> 8) & 0xff) % 200 + 55;
    const b = ((hash >> 16) & 0xff) % 200 + 55;
    return hover ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},0.8)`;
  }

  stringToOppositeColour(input: string) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = input.charCodeAt(i) + ((hash << 5) - hash);
    }

    const r = 255 - (hash & 0xff) % 200 + 55;
    const g = 255 - ((hash >> 8) & 0xff) % 200 + 55;
    const b = 255 - ((hash >> 16) & 0xff) % 200 + 55;
    return `rgb(${r},${g},${b})`;
  }
}
