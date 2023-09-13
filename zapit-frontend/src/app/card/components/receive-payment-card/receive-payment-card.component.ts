import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import { RxStompService } from '../../../shared/services/rx-stomp.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IMessage } from '@stomp/rx-stomp';
import { first, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../card';
import { CardMessage } from '../../../shared/interfaces/card-message';
import { CardMessageType } from '../../../shared/interfaces/card-message-type';

@Component({
  selector: 'app-receive-payment-card',
  templateUrl: './receive-payment-card.component.html',
  styleUrls: ['./receive-payment-card.component.css'],
})
export class ReceivePaymentCardComponent implements OnInit, OnDestroy {
  private cardService = inject(CardService);
  private rxStompService = inject(RxStompService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  card!: Card;
  cardId!: string;
  cardForm!: FormGroup;
  messageInPath!: string;
  messageOutPath!: string;
  isWaitingForApproval: boolean = false;
  message!: string;
  messageSubscription?: Subscription;

  ngOnInit() {
    this.cardId = String(this.route.snapshot.paramMap.get('cardId'));
    this.messageInPath = `/card/${this.cardId}/receive`;
    this.messageOutPath = `/card/${this.cardId}/send`;
    this.cardForm = this.fb.group({
      amount: this.fb.control<number>(1, [
        Validators.required,
        Validators.min(1),
      ]),
    });
    this.getCardById(this.cardId);
    this.receiveData();
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  onSubmit() {
    try {
      this.publishData({
        type: CardMessageType.REQUEST_FOR_PAYMENT,
        amount: this.amount.value,
      });
      this.isWaitingForApproval = true;
    } catch (e) {
      console.error(e);
    }
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
          switch (response.type) {
            case CardMessageType.REQUEST_APPROVED:
              this.message = `Approved payment of ${response.amount}.`;
              this.isWaitingForApproval = false;
              break;
            case CardMessageType.REQUEST_REJECTED:
              this.message = `Rejected payment of ${response.amount}.`;
              this.isWaitingForApproval = false;
              break;
            case CardMessageType.PAYMENT_SUCCEEDED:
              this.message = `Confirmed payment of ${response.amount}.`;
              this.isWaitingForApproval = false;
              void this.router.navigate(
                ['/card', this.cardId, 'receive', 'complete'],
                { queryParams: { txn: response.transaction } },
              );
              break;
          }
        }
      });
  }

  get amount() {
    return this.cardForm.get('amount') as FormControl;
  }
}
