import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../invoice';
import { first } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-invoices',
  templateUrl: './view-invoices.component.html',
  styleUrls: ['./view-invoices.component.css'],
})
export class ViewInvoicesComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private route = inject(ActivatedRoute);
  invoices!: Invoice[];
  page!: number;
  limit: number = 10;

  ngOnInit() {
    this.page = Number(this.route.snapshot.queryParamMap.get('page') ?? 1);
    this.getInvoicesByUserId(this.page);
  }

  getInvoicesByUserId(page: number) {
    this.invoiceService
      .getInvoicesByUserId(this.limit, (page - 1) * this.limit)
      .pipe(first())
      .subscribe({
        next: (invoices) => (this.invoices = invoices),
        error: (err) => console.log(err.message),
      });
  }
}
