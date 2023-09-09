import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QRCodeComponent } from 'angularx-qrcode';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../invoice';
import { first, Subscription } from 'rxjs';
import { RxStompService } from '../../../shared/services/rx-stomp.service';
import { Message } from 'postcss';
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
  qrCodeData!: string;
  messageSubscription?: Subscription;
  isClaimed = false;

  ngOnInit() {
    this.receiveData();
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    const INVOICE_ID = String(this.route.snapshot.paramMap.get('invoiceId'));
    const TIMESTAMP = Number(this.route.snapshot.queryParamMap.get('t'));
    this.qrCodeData = `${BASE_URL}/#/invoice/${INVOICE_ID}/claim?t=`;
    this.invoiceService
      .getInvoiceById(INVOICE_ID, TIMESTAMP)
      .pipe(first())
      .subscribe({
        next: (invoice) => {
          this.qrCodeData += invoice.createdOn;
        },
        error: (err) =>
          this.router.navigate(['/']).then(() => console.error(err.message)),
      });
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  receiveData() {
    const INVOICE_ID = String(this.route.snapshot.paramMap.get('invoiceId'));
    const TIMESTAMP = Number(this.route.snapshot.queryParamMap.get('t'));
    this.messageSubscription = this.rxStompService
      .watch(`/invoice/${INVOICE_ID}-${TIMESTAMP}`)
      .subscribe((message: IMessage) => {
        console.log(message.body) // TODO remove
        if (message.body) {
          this.invoiceService.getInvoiceById(INVOICE_ID, TIMESTAMP)
              .pipe(first())
              .subscribe({
                next: invoice => {
                  if (Number(message.body) == invoice.claimedBy?.id) {
                    this.isClaimed = true;
                  }
                },
                error: err => console.error(err.message)
              })
        }
      });
  }
}
