import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import { Card } from '../../card';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subscription } from 'rxjs';
import { IMessage } from '@stomp/rx-stomp';
import { RxStompService } from '../../../shared/services/rx-stomp.service';
import { CardMessage } from '../../../shared/interfaces/card-message';
import { LocationData } from '../../../shared/interfaces/location-data';

@Component({
  selector: 'app-send-payment-card-confirm',
  templateUrl: './send-payment-card-confirm.component.html',
  styleUrls: ['./send-payment-card-confirm.component.css'],
})
export class SendPaymentCardConfirmComponent implements OnInit, OnDestroy {
  private cardService = inject(CardService);
  private rxStompService = inject(RxStompService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  card!: Card;
  locationData!: LocationData;
  cardId!: string;
  amount!: number;
  timeLeftInSeconds: number = 30;
  messageSubscription?: Subscription;

  ngOnInit() {
    this.cardId = String(this.route.snapshot.paramMap.get('cardId'));
    this.amount = Number(this.route.snapshot.queryParamMap.get('amt'));
    this.getLocationData();
    this.receiveData();
    this.cardService
      .getCardById(this.cardId)
      .pipe(first())
      .subscribe({
        next: (card) => (this.card = card),
        error: (err) => console.error(err.message),
      });
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  onApprovePayment() {
    this.publishData({ type: 'APPROVED', amount: this.amount });
    this.cardService
      .deductFromCard(this.cardId, this.amount, this.locationData)
      .pipe(first())
      .subscribe({
        next: (transaction) => {
          this.publishData({
            type: 'CONFIRMED',
            amount: this.amount,
            transaction: transaction.id,
          });
          this.router
            .navigate(['/card', this.cardId, 'send', 'complete'], {
              queryParams: { txn: transaction.id },
            })
            .then(() => console.log(transaction));
        },
        error: (err) => console.error(err.message),
      });
  }

  onRejectPayment() {
    this.publishData({ type: 'REJECTED', amount: this.amount });
  }

  publishData(body: CardMessage) {
    this.rxStompService.publish({
      destination: `/card/${this.cardId}/receive`,
      body: JSON.stringify(body),
    });
  }

  receiveData() {
    this.messageSubscription = this.rxStompService
      .watch(`/card/${this.cardId}/send`)
      .subscribe((message: IMessage) => {
        console.log('>>>>>' + message);
        if (message.body) {
          const response: CardMessage = JSON.parse(message.body);
          if (response.type == 'REQUEST_TO_CONFIRM') {
            this.router
              .navigate(['card', this.cardId, 'send', 'confirm'], {
                queryParams: { amt: response.amount },
              })
              .then(() =>
                console.log(new Date(), 'Request to confirm received.'),
              );
          }
        }
      });
  }

  getLocationData() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.locationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      console.log(
        `Location obtained: ${this.locationData.latitude}, ${this.locationData.longitude}`,
      );
    });
  }

  startCountdown() {
    if (this.timeLeftInSeconds > 0) {
      setTimeout(this.startCountdown, 1000);
    }
    this.timeLeftInSeconds -= 1;
  }
}
