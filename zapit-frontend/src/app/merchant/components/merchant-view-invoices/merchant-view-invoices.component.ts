import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../../invoice/services/invoice.service';
import { Invoice } from '../../../invoice/invoice';
import { first } from 'rxjs';

@Component({
  selector: 'app-merchant-view-invoices',
  templateUrl: './merchant-view-invoices.component.html',
  styleUrls: ['./merchant-view-invoices.component.css'],
})
export class MerchantViewInvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  invoices!: Invoice[];

  ngOnInit() {
    this.getInvoicesByMerchantId();
  }

  getInvoicesByMerchantId() {
    this.invoiceService
      .getInvoicesByMerchantId()
      .pipe(first())
      .subscribe({
        next: (invoices) => (this.invoices = invoices),
        error: (err) => console.log(err.message),
      });
  }
}
