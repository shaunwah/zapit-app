import {Component, inject, OnInit} from '@angular/core';
import {CardService} from "../../services/card.service";
import {TransactionService} from "../../../transaction/services/transaction.service";
import {ActivatedRoute, Router} from "@angular/router";
import {first} from "rxjs";
import {Transaction} from "../../../transaction/transaction";

@Component({
  selector: 'app-send-payment-card-end',
  templateUrl: './send-payment-card-end.component.html',
  styleUrls: ['./send-payment-card-end.component.css']
})
export class SendPaymentCardEndComponent implements OnInit {
  private cardService = inject(CardService)
  private transactionService = inject(TransactionService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  cardId!: string;
  transaction!: Transaction;
  transactionId: number = 1;

  ngOnInit() {
    this.cardId = String(this.route.snapshot.paramMap.get("cardId"));
    this.transactionId = Number(this.route.snapshot.queryParamMap.get("txn"))
    if (this.transactionId) {
      this.fetchTransactionData();
    }
  }

  fetchTransactionData() {
    this.transactionService.getTransactionById(this.transactionId)
        .pipe(first())
        .subscribe({
          next: transaction => this.transaction = transaction,
          error: err => console.error(err.message)
        })
  }

  isPositive(amount: number) {
    return Math.sign(amount) == 1;
  }

  addPlusSign(amount: number) {
    return this.isPositive(amount) ? '+' : '';
  }
}
