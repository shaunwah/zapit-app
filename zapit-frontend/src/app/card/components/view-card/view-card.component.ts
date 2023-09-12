import { Component, inject, OnInit } from '@angular/core';
import { CardService } from '../../services/card.service';
import { Card } from '../../card';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { TransactionService } from '../../../transaction/services/transaction.service';
import { Transaction } from '../../../transaction/transaction';

@Component({
  selector: 'app-view-card',
  templateUrl: './view-card.component.html',
  styleUrls: ['./view-card.component.css'],
})
export class ViewCardComponent implements OnInit {
  private cardService = inject(CardService);
  private transactionService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  card!: Card;
  cardId!: string;
  transactions!: Transaction[];
  page: number = 1;
  limit: number = 10;

  ngOnInit() {
    this.cardId = String(this.route.snapshot.paramMap.get('cardId'));
    this.cardService
      .getCardById(this.cardId)
      .pipe(first())
      .subscribe({
        next: (card) => {
          this.card = card;
          this.fetchNewData(this.page);
        },
        error: (err) => console.error(err.message),
      });
  }

  fetchNewData(page: number) {
    this.transactionService
      .getTransactionsByCardId(this.cardId, this.limit, (page - 1) * this.limit)
      .pipe(first())
      .subscribe({
        next: (transactions) => (this.transactions = transactions),
        error: (err) => console.error(err.message),
      });
  }
}
