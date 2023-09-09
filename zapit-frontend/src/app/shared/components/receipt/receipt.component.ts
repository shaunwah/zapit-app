import {Component, Input} from '@angular/core';
import {Invoice} from "../../../invoice/invoice";

@Component({
  selector: 's-app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent {
  @Input() invoice!: Invoice;

  calculateSalesTaxAmount() {
    return (this.invoice.total! - this.invoice.additionalCharges) / (1 + this.invoice.salesTax) * this.invoice.salesTax;
  }
}
