import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import { RxStompService } from '../../../shared/services/rx-stomp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IMessage, StompHeaders } from '@stomp/rx-stomp';
import { first, Subscription } from 'rxjs';
import { CardMessage } from '../../../shared/interfaces/card-message';
import { Card } from '../../card';
import { Transaction } from '../../../transaction/transaction';

@Component({
  selector: 'app-send-payment-card',
  templateUrl: './send-payment-card.component.html',
  styleUrls: ['./send-payment-card.component.css'],
})
export class SendPaymentCardComponent implements OnInit, OnDestroy {
  private cardService = inject(CardService);
  private rxStompService = inject(RxStompService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  card!: Card;
  cardId!: string;
  qrCodeData!: string;
  messageSubscription?: Subscription;

  ngOnInit() {
    this.cardId = String(this.route.snapshot.paramMap.get('cardId'));
    this.receiveData();
    const BASE_URL = `${window.location.protocol}//${window.location.host}`;
    this.qrCodeData = `${BASE_URL}/#/card/${this.cardId}/receive`;
    this.cardService
      .getCardById(this.cardId)
      .pipe(first())
      .subscribe({
        next: (card) => {
          this.card = card;
        },
        error: (err) => console.error(err.message),
      });
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  receiveData() {
    this.messageSubscription = this.rxStompService
      .watch(`/card/${this.cardId}/send`)
      .subscribe((message: IMessage) => {
        if (message.body) {
          const response: CardMessage = JSON.parse(message.body);
          if (response.type == 'REQUEST_TO_CONFIRM') {
            this.router
              .navigate(['/card', this.cardId, 'send', 'confirm'], {
                queryParams: { amt: response.amount },
              })
              .then(() =>
                console.log(new Date(), 'Request to confirm received.'),
              );
          }
        }
      });
  }
}
