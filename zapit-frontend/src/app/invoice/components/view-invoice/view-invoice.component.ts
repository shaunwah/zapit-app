import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from '../../invoice';
import { first } from 'rxjs';
import {AttributionControl, FullscreenControl, GeolocateControl, Map, NavigationControl} from "mapbox-gl";
import * as mapboxgl from "mapbox-gl";
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
  mapbox!: Map;
  mapboxCenter!: { lat: number, lng: number };

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
          this.mapboxCenter = { lat: invoice.claimedAt?.latitude || 0, lng: invoice.claimedAt?.longitude || 0 }
          const MAPBOX_DATA = new Map({
            accessToken: 'pk.eyJ1Ijoic2hhdW53YWgiLCJhIjoiY2ptd2FtcG50MDdxbjNxdG54emhlbzMyYSJ9.fjngawrwN76rk4TRJETvDw',
            container: 'mapbox',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: this.mapboxCenter,
            zoom: 15,
          });
          const MAPBOX_MARKER = new mapboxgl.Marker()
              .setLngLat(this.mapboxCenter)
              .addTo(MAPBOX_DATA);
          MAPBOX_DATA.addControl(new FullscreenControl());
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
