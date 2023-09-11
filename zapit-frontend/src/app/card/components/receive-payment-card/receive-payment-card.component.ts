import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import { RxStompService } from '../../../shared/services/rx-stomp.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMessage } from '@stomp/rx-stomp';
import { first, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../../card';
import { CardMessage } from '../../../shared/interfaces/card-message';

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
  isWaitingForApproval: boolean = false;
  message!: string;
  messageSubscription?: Subscription;

  ngOnInit() {
    this.cardId = String(this.route.snapshot.paramMap.get('cardId'));
    this.cardService
      .getCardById(this.cardId)
      .pipe(first())
      .subscribe({
        next: (card) => (this.card = card),
        error: (err) => console.error(err.message),
      });
    this.receiveData();
    this.cardForm = this.fb.group({
      amount: this.fb.control<number>(1, [
        Validators.required,
        Validators.min(1),
      ]),
    });
  }

  ngOnDestroy() {
    this.messageSubscription?.unsubscribe();
  }

  onSubmit() {
    try {
      this.publishData({
        type: 'REQUEST_TO_CONFIRM',
        amount: this.amount.value,
      });
      this.isWaitingForApproval = true;
      this.publishData({
        type: 'REQUEST_TO_CONFIRM',
        amount: this.amount.value,
      });
    } catch (e) {
      console.error(e);
    }
  }

  publishData(body: CardMessage) {
    this.rxStompService.publish({
      destination: `/card/${this.cardId}/send`,
      body: JSON.stringify(body),
    });
  }

  receiveData() {
    this.messageSubscription = this.rxStompService
      .watch(`/card/${this.cardId}/receive`)
      .subscribe((message: IMessage) => {
        if (message.body) {
          const response: CardMessage = JSON.parse(message.body);
          switch (response.type) {
            case 'APPROVED':
              this.message = `Approved payment of ${response.amount}.`;
              this.isWaitingForApproval = false;
              break;
            case 'REJECTED':
              this.message = `Rejected payment of ${response.amount}.`;
              this.isWaitingForApproval = false;
              break;
            case 'CONFIRMED':
              this.message = `Confirmed payment of ${response.amount}.`;
              this.isWaitingForApproval = false;
              this.router.navigate(
                ['/card', this.cardId, 'receive', 'complete'],
                { queryParams: { txn: response.transaction } },
              );
              break;
          }
        }
      });
  }

  get amount() {
    return this.cardForm.get('amount')!;
  }
}
