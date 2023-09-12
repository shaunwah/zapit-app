import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../../invoice/services/invoice.service';
import { Invoice } from '../../../invoice/invoice';
import { first } from 'rxjs';
import { TransactionService } from '../../../transaction/services/transaction.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private transactionService = inject(TransactionService);
  invoices!: Invoice[];
  invoicesTotal!: number;
  transactionsTotal!: number;

  ngOnInit() {
    this.invoiceService
      .getInvoicesByUserId(5)
      .pipe(first())
      .subscribe({
        next: (invoices) => (this.invoices = invoices),
        error: (err) => console.error(err.message),
      });
    this.invoiceService
      .getInvoicesTotalByUserId()
      .pipe(first())
      .subscribe({
        next: (invoicesTotal) => (this.invoicesTotal = invoicesTotal),
        error: (err) => console.error(err.message),
      });
    this.transactionService
      .getTransactionsTotalByUserId()
      .pipe(first())
      .subscribe({
        next: (transactionsTotal) =>
          (this.transactionsTotal = transactionsTotal),
        error: (err) => console.error(err.message),
      });
  }
}
