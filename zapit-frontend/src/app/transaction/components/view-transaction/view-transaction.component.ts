import { Component, inject, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../../transaction';
import { first } from 'rxjs';
import {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
} from 'mapbox-gl';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-transaction',
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.css'],
})
export class ViewTransactionComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  transaction!: Transaction;
  transactionId!: number;
  mapbox!: Map;
  mapboxCenter!: { lat: number; lng: number };

  ngOnInit() {
    this.transactionId = Number(
      this.route.snapshot.paramMap.get('transactionId'),
    );
    this.transactionService
      .getTransactionById(this.transactionId)
      .pipe(first())
      .subscribe({
        next: (transaction) => {
          this.transaction = transaction;
          this.renderMapbox(transaction);
        },
        error: (err) => console.error(err.message),
      });
  }

  renderMapbox(transaction: Transaction) {
    this.mapboxCenter = {
      lat: transaction.location.latitude ?? 0,
      lng: transaction.location.longitude ?? 0,
    };
    const MAPBOX_DATA = new Map({
      accessToken: environment.mapboxApiKey,
      container: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.mapboxCenter,
      zoom: 15,
    });
    new mapboxgl.Marker().setLngLat(this.mapboxCenter).addTo(MAPBOX_DATA);
    MAPBOX_DATA.addControl(new FullscreenControl());
  }

  isPositive(amount: number) {
    return Math.sign(amount) == 1;
  }

  addPlusSign(amount: number) {
    return this.isPositive(amount) ? '+' : '';
  }
}
