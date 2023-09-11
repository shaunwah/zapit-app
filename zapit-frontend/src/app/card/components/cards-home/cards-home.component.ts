import {Component, inject, OnInit} from '@angular/core';
import {CardService} from "../../services/card.service";
import {Card} from "../../card";
import {first} from "rxjs";
import {TransactionService} from "../../../transaction/services/transaction.service";
import {Transaction} from "../../../transaction/transaction";

@Component({
  selector: 'app-cards-home',
  templateUrl: './cards-home.component.html',
  styleUrls: ['./cards-home.component.css']
})
export class CardsHomeComponent implements OnInit {
  private cardService = inject(CardService);
  private transactionService = inject(TransactionService)
  cards!: Card[];
  transactions!: Transaction[];
  placeholderCards!: number[];
  maxCardCount = 5;

  ngOnInit() {
    this.cardService.getCardsByUserId(this.maxCardCount)
      .pipe(first())
      .subscribe({
        next: cards => {
          this.cards = cards
          this.placeholderCards = Array(this.maxCardCount - cards.length).fill(1).map((_, i) => i);
        },
        error: err => console.error(err.message)
      })
    this.transactionService.getTransactionsByUserId(5)
      .pipe(first())
      .subscribe({
        next: transactions => this.transactions = transactions,
        error: err => console.error(err.message)
      })
  }
}
