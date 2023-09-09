import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../../invoice/services/invoice.service';
import { Invoice } from '../../../invoice/invoice';
import { first } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  invoices!: Invoice[];

  ngOnInit() {
    this.invoiceService
      .getInvoicesByUserId()
      .pipe(first())
      .subscribe({
        next: (invoices) => (this.invoices = invoices),
        error: (err) => console.error(err.message),
      });
  }
}
