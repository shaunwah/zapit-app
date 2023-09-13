import { Component, inject, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from '../../transaction';
import { first } from 'rxjs';
import { FullscreenControl, Map } from 'mapbox-gl';
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
    this.getTransactionById(this.transactionId);
  }

  getTransactionById(transactionId: number) {
    this.transactionService
      .getTransactionById(transactionId)
      .pipe(first())
      .subscribe({
        next: (transaction) => {
          this.transaction = transaction;
          if (
            transaction.location &&
            transaction.location.latitude != 0 &&
            transaction.location.longitude != 0
          ) {
            this.renderMapbox(transaction);
          }
        },
        error: (err) => console.error(err.message),
      });
  }

  renderMapbox(transaction: Transaction) {
    this.mapboxCenter = {
      lat: transaction.location!.latitude,
      lng: transaction.location!.longitude,
    };
    const mapboxData = new Map({
      accessToken: environment.mapboxApiKey,
      container: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: this.mapboxCenter,
      zoom: 15,
    });
    new mapboxgl.Marker().setLngLat(this.mapboxCenter).addTo(mapboxData);
    mapboxData.addControl(new FullscreenControl());
  }

  isPositive(amount: number) {
    return Math.sign(amount) == 1;
  }

  addPlusSign(amount: number) {
    return this.isPositive(amount) ? '+' : '';
  }
}
