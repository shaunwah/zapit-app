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
  relatedInvoices!: Invoice[];

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      const invoiceId = paramMap.get('invoiceId')!;
      this.renderData(invoiceId);
    });
  }

  renderData(invoiceId: string) {
    // TODO remove nested sub
    const TIMESTAMP = Number(this.route.snapshot.queryParamMap.get("t"));
    this.invoiceService
      .getInvoiceById(invoiceId, TIMESTAMP)
      .pipe(first())
      .subscribe({
        next: (invoice) => {
          this.invoice = invoice;
          this.invoiceService
            .getInvoicesByMerchantIdAndUserId(invoice.issuedBy!.id, invoiceId)
            .pipe(first())
            .subscribe({
              next: (invoices) => (this.relatedInvoices = invoices),
              error: (err) => console.error(err.message),
            });
        },
        error: (err) => console.error(err.message),
      });
  }
}
