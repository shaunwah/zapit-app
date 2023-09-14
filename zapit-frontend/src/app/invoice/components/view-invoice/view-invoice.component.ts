import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from '../../invoice';
import { first } from 'rxjs';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.css'],
})
export class ViewInvoiceComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private route = inject(ActivatedRoute);
  invoice!: Invoice;
  timestamp!: number;
  relatedInvoices!: Invoice[];

  ngOnInit() {
    this.timestamp = Number(this.route.snapshot.queryParamMap.get('t'));
    this.checkForUpdates();
  }

  checkForUpdates() {
    this.route.paramMap.subscribe((paramMap) => {
      const invoiceId = String(paramMap.get('invoiceId'));
      this.getInvoiceById(invoiceId);
    });
  }

  getInvoiceById(invoiceId: string) {
    this.invoiceService
      .getInvoiceById(invoiceId, this.timestamp)
      .pipe(first())
      .subscribe({
        next: (invoice) => {
          this.invoice = invoice;
          this.getInvoicesByMerchantIdAndUserId(
            invoice.issuedBy!.id!,
            invoiceId,
          );
        },
        error: (err) => console.error(err.message),
      });
  }

  getInvoicesByMerchantIdAndUserId(merchantId: number, invoiceId: string) {
    this.invoiceService
      .getInvoicesByMerchantIdAndUserId(merchantId, invoiceId)
      .pipe(first())
      .subscribe({
        next: (invoices) => (this.relatedInvoices = invoices),
        error: (err) => console.error(err.message),
      });
  }
}
