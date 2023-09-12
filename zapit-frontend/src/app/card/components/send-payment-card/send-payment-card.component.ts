import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import { RxStompService } from '../../../shared/services/rx-stomp.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IMessage } from '@stomp/rx-stomp';
import { first, Subscription } from 'rxjs';
import { CardMessage } from '../../../shared/interfaces/card-message';
import { Card } from '../../card';
import { CardMessageType } from '../../../shared/interfaces/card-message-type';

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
  messageInPath!: string;
  messageOutPath!: string;
  qrCodeData!: string;
  messageSubscription?: Subscription;

  ngOnInit() {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    this.cardId = String(this.route.snapshot.paramMap.get('cardId'));
    this.messageInPath = `/card/${this.cardId}/send`;
    this.messageOutPath = `/card/${this.cardId}/receive`;
    this.qrCodeData = `${baseUrl}/#/card/${this.cardId}/receive`;
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
        next: (card) => {
          this.card = card;
        },
        error: (err) => console.error(err.message),
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
              ['/card', this.cardId, 'send', 'confirm'],
              {
                queryParams: { amt: response.amount },
              },
            );
          }
        }
      });
  }
}
