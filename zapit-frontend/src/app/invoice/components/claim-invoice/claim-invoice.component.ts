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
  locationData!: LocationData;

  ngOnInit() {
    const INVOICE_ID = String(this.route.snapshot.paramMap.get('invoiceId'));
    const TIMESTAMP = Number(this.route.snapshot.queryParamMap.get('t'));
    this.invoiceService
      .getInvoiceById(INVOICE_ID, TIMESTAMP)
      .pipe(first())
      .subscribe({
        next: (invoice) => {
          if (invoice.claimedBy) {
            this.router
              .navigate(['/'])
              .then(() => console.log('claimed already'));
          }
          this.invoice = invoice;
        },
        error: (err) => console.error(err.message),
      });
    this.getCurrentPosition();
  }

  onClaim() {
    const INVOICE_ID = String(this.route.snapshot.paramMap.get('invoiceId'));
    const TIMESTAMP = Number(this.route.snapshot.queryParamMap.get('t'));
    this.invoiceService
      .claimInvoice(INVOICE_ID, TIMESTAMP, this.locationData)
      .pipe(first())
      .subscribe({
        next: (invoice) => {
          this.publishData((invoice as any).userId);
          this.router.navigate(['/']).then(() => console.log('claimed!'));
        },
        error: (err) => console.error(err.message),
      });
  }

  publishData(body: string) {
    const INVOICE_ID = String(this.route.snapshot.paramMap.get('invoiceId'));
    const TIMESTAMP = Number(this.route.snapshot.queryParamMap.get('t'));
    this.rxStompService.publish({
      destination: `/invoice/${INVOICE_ID}-${TIMESTAMP}`,
      body,
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
}
