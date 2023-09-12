import { Component, inject } from '@angular/core';
import { first } from 'rxjs';
import { Transaction } from '../../transaction';
import { TransactionService } from '../../services/transaction.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-transactions',
  templateUrl: './view-transactions.component.html',
  styleUrls: ['./view-transactions.component.css'],
})
export class ViewTransactionsComponent {
  private transactionService = inject(TransactionService);
  private route = inject(ActivatedRoute);
  transactions!: Transaction[];
  page!: number;
  limit = 10;

  ngOnInit() {
    this.page = Number(this.route.snapshot.queryParamMap.get('page') ?? 1);
    this.getTransactionsByUserId(this.page);
  }

  getTransactionsByUserId(page: number) {
    this.transactionService
      .getTransactionsByUserId(this.limit, (page - 1) * this.limit)
      .pipe(first())
      .subscribe({
        next: (transactions) => (this.transactions = transactions),
        error: (err) => console.log(err.message),
      });
  }
}
