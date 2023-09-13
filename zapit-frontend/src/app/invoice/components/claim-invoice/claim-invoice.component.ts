import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Invoice } from '../../invoice';
import { first } from 'rxjs';
import { LocationData } from '../../../shared/interfaces/location-data';
import { RxStompService } from '../../../shared/services/rx-stomp.service';

@Component({
  selector: 'app-claim-invoice',
  templateUrl: './claim-invoice.component.html',
  styleUrls: ['./claim-invoice.component.css'],
})
export class ClaimInvoiceComponent implements OnInit {
  private invoiceService = inject(InvoiceService);
  private rxStompService = inject(RxStompService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  invoice!: Invoice;
  invoiceId!: string;
  timestamp!: number;
  messageOutPath!: string;
  locationData?: LocationData;
  isWaiting!: boolean;

  ngOnInit() {
    this.invoiceId = String(this.route.snapshot.paramMap.get('invoiceId'));
    this.timestamp = Number(this.route.snapshot.queryParamMap.get('t'));
    this.messageOutPath = `/invoice/${this.invoiceId}-${this.timestamp}/scan`;
    this.getCurrentPosition();
    this.onDelay(3000);
    this.getInvoiceById(this.invoiceId, this.timestamp);
  }

  onSubmit() {
    this.claimInvoice(this.invoiceId, this.timestamp, this.locationData);
  }

  getInvoiceById(invoiceId: string, timestamp: number) {
    this.invoiceService
      .getInvoiceById(invoiceId, timestamp)
      .pipe(first())
      .subscribe({
        next: (invoice) => {
          if (invoice.claimedBy) {
            void this.router.navigate(['/invoices'], {
              queryParams: { claimed: true },
            });
          }
          this.invoice = invoice;
        },
        error: (err) => console.error(err.message),
      });
  }

  claimInvoice(
    invoiceId: string,
    timestamp: number,
    locationData?: LocationData,
  ) {
    this.invoiceService
      .claimInvoice(invoiceId, timestamp, locationData)
      .pipe(first())
      .subscribe({
        next: (invoice) => {
          this.publishData((invoice as any).userId); // TODO check
          return this.router.navigate(['/']);
        },
        error: (err) => console.error(err.message),
      });
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.info(
          `Location data obtained (${this.locationData.latitude}, ${this.locationData.longitude})`,
        );
      },
      () => {
        console.info(`Failed to obtain location data`);
      },
    );
  }

  onDelay(ms: number) {
    this.isWaiting = true;
    setTimeout(() => {
      this.isWaiting = false;
    }, ms);
  }

  publishData(body: string) {
    this.rxStompService.publish({
      destination: this.messageOutPath,
      body,
    });
  }
}
