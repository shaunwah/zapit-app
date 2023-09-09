import {Component, Input} from '@angular/core';
import {Invoice} from "../../../invoice/invoice";

@Component({
  selector: 's-app-invoice-list-group',
  templateUrl: './invoice-list-group.component.html',
  styleUrls: ['./invoice-list-group.component.css']
})
export class InvoiceListGroupComponent {
  @Input() invoices!: Invoice[];
  @Input() displaySeeAll: boolean = false;
}
