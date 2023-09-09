import {Component, inject, OnInit} from '@angular/core';
import {InvoiceService} from "../../services/invoice.service";
import {Invoice} from "../../invoice";
import {first} from "rxjs";

@Component({
  selector: 'app-view-invoices',
  templateUrl: './view-invoices.component.html',
  styleUrls: ['./view-invoices.component.css']
})
export class ViewInvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  invoices!: Invoice[];

  ngOnInit() {
    this.invoiceService
      .getInvoicesByUserId()
      .pipe(first())
      .subscribe({
        next: (invoices) => (this.invoices = invoices),
        error: (err) => console.log(err.message),
      });
  }
}
