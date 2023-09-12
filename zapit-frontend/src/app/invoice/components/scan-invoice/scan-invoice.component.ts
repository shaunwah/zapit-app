import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { first, Subscription } from 'rxjs';
import { RxStompService } from '../../../shared/services/rx-stomp.service';
import { IMessage } from '@stomp/rx-stomp';

@Component({
  selector: 'app-scan-invoice',
  templateUrl: './scan-invoice.component.html',
  styleUrls: ['./scan-invoice.component.css'],
})
export class ScanInvoiceComponent implements OnInit, OnDestroy {
  private invoiceService = inject(InvoiceService);
  private rxStompService = inject(RxStompService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  invoiceId!: string;
  timestamp!: number;
  qrCodeData!: string;
  messageInPath!: string;
  messageSubscription?: Subscription;
  isClaimed = false;

  ngOnInit() {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    this.invoiceId = String(this.route.snapshot.paramMap.get('invoiceId'));
    this.timestamp = Number(this.route.snapshot.queryParamMap.get('t'));
    this.messageInPath = `/invoice/${this.invoiceId}-${this.timestamp}/scan`;
    this.qrCodeData = `${baseUrl}/#/invoice/${this.invoiceId}/claim?t=`;
    this.getInvoiceById(this.invoiceId, this.timestamp);
    this.receiveData();
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  getInvoiceById(invoiceId: string, timestamp: number) {
    this.invoiceService
      .getInvoiceById(invoiceId, timestamp)
      .pipe(first())
      .subscribe({
        next: (invoice) => {
          this.qrCodeData += invoice.createdOn;
        },
        error: (err) => {
          console.error(err.message);
          return this.router.navigate(['/']);
        },
      });
  }

  receiveData() {
    this.messageSubscription = this.rxStompService
      .watch(this.messageInPath)
      .subscribe((message: IMessage) => {
        if (message.body) {
          this.invoiceService
            .getInvoiceById(this.invoiceId, this.timestamp)
            .pipe(first())
            .subscribe({
              next: (invoice) => {
                if (Number(message.body) == invoice.claimedBy?.id) {
                  this.isClaimed = true;
                }
              },
              error: (err) => console.error(err.message),
            });
        }
      });
  }
}
