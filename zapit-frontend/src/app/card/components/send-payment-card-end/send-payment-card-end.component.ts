import { Component, inject, OnInit } from '@angular/core';
import { TransactionService } from '../../../transaction/services/transaction.service';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { Transaction } from '../../../transaction/transaction';

@Component({
  selector: 'app-send-payment-card-end',
  templateUrl: './send-payment-card-end.component.html',
  styleUrls: ['./send-payment-card-end.component.css'],
})
export class SendPaymentCardEndComponent implements OnInit {
  private transactionService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  cardId!: string;
  transaction!: Transaction;
  transactionId!: number;

  ngOnInit() {
    this.cardId = String(this.route.snapshot.paramMap.get('cardId'));
    this.transactionId = Number(this.route.snapshot.queryParamMap.get('txn'));
    if (this.transactionId) {
      this.getTransactionById(this.transactionId);
    }
  }

  getTransactionById(transactionId: number) {
    this.transactionService
      .getTransactionById(transactionId)
      .pipe(first())
      .subscribe({
        next: (transaction) => (this.transaction = transaction),
        error: (err) => console.error(err.message),
      });
  }

  isPositive(amount: number) {
    return Math.sign(amount) == 1;
  }

  addPlusSign(amount: number) {
    return this.isPositive(amount) ? '+' : '';
  }
}
