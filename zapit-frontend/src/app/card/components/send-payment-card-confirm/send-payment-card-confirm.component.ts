import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import { Card } from '../../card';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subscription } from 'rxjs';
import { IMessage } from '@stomp/rx-stomp';
import { RxStompService } from '../../../shared/services/rx-stomp.service';
import { CardMessage } from '../../../shared/interfaces/card-message';
import { LocationData } from '../../../shared/interfaces/location-data';
import { CardMessageType } from '../../../shared/interfaces/card-message-type';

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
  locationData?: LocationData;
  isWaiting!: boolean;
  messageInPath!: string;
  messageOutPath!: string;
  cardId!: string;
  amount!: number;
  messageSubscription?: Subscription;

  ngOnInit() {
    this.cardId = String(this.route.snapshot.paramMap.get('cardId'));
    this.amount = Number(this.route.snapshot.queryParamMap.get('amt'));
    this.messageInPath = `/card/${this.cardId}/send`;
    this.messageOutPath = `/card/${this.cardId}/receive`;
    this.getCurrentPosition();
    this.onDelay(3000);
    this.getCardById(this.cardId);
    this.receiveData();
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  getCardById(cardId: string) {
    this.cardService
      .getCardById(cardId)
      .pipe(first())
      .subscribe({
        next: (card) => (this.card = card),
        error: (err) => console.error(err.message),
      });
  }

  onApprovePayment() {
    this.publishData({
      type: CardMessageType.REQUEST_APPROVED,
      amount: this.amount,
    });
    this.deductFromCard(this.cardId, this.amount, this.locationData);
  }

  onRejectPayment() {
    this.publishData({
      type: CardMessageType.REQUEST_REJECTED,
      amount: this.amount,
    });
    return this.router.navigate(['/card', this.cardId]);
  }

  deductFromCard(cardId: string, amount: number, locationData?: LocationData) {
    this.cardService
      .deductFromCard(cardId, amount, locationData)
      .pipe(first())
      .subscribe({
        next: (transaction) => {
          this.publishData({
            type: CardMessageType.PAYMENT_SUCCEEDED,
            amount: this.amount,
            transaction: transaction.id,
          });
          return this.router.navigate(
            ['/card', this.cardId, 'send', 'complete'],
            {
              queryParams: { txn: transaction.id },
            },
          );
        },
        error: () =>
          this.publishData({
            type: CardMessageType.PAYMENT_FAILED,
            amount: this.amount,
          }),
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

  publishData(body: CardMessage) {
    this.rxStompService.publish({
      destination: this.messageOutPath,
      body: JSON.stringify(body),
    });
  }

  receiveData() {
    this.messageSubscription = this.rxStompService
      .watch(this.messageInPath)
      .subscribe((message: IMessage) => {
        if (message.body) {
          const response: CardMessage = JSON.parse(message.body);
          if (response.type == CardMessageType.REQUEST_FOR_PAYMENT) {
            void this.router.navigate(
              ['card', this.cardId, 'send', 'confirm'],
              {
                queryParams: { amt: response.amount },
              },
            );
          }
        }
      });
  }
}
