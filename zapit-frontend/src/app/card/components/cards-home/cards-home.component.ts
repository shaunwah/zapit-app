import { Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import { Card } from '../../card';
import { first } from 'rxjs';
import { TransactionService } from '../../../transaction/services/transaction.service';
import { Transaction } from '../../../transaction/transaction';

@Component({
  selector: 'app-cards-home',
  templateUrl: './cards-home.component.html',
  styleUrls: ['./cards-home.component.css'],
})
export class CardsHomeComponent implements OnInit {
  private cardService = inject(CardService);
  private transactionService = inject(TransactionService);
  cards!: Card[];
  transactions!: Transaction[];
  placeholderCards: number[] = Array.from({ length: 5 }, () => 1);
  maxCardCount = 5;

  ngOnInit() {
    this.getCardsByUserId(this.maxCardCount);
    this.getTransactionsByUserId();
  }

  getCardsByUserId(limit: number) {
    this.cardService
      .getCardsByUserId(limit)
      .pipe(first())
      .subscribe({
        next: (cards) => {
          this.cards = cards;
          this.placeholderCards = Array.from(
            { length: this.maxCardCount - cards.length },
            () => 1,
          );
        },
        error: (err) => console.error(err.message),
      });
  }

  getTransactionsByUserId() {
    this.transactionService
      .getTransactionsByUserId()
      .pipe(first())
      .subscribe({
        next: (transactions) => (this.transactions = transactions),
        error: (err) => console.error(err.message),
      });
  }
}
