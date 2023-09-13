import { Component, Input } from '@angular/core';
import { Transaction } from '../../../transaction/transaction';

@Component({
  selector: 's-app-transaction-list-group',
  templateUrl: './transaction-list-group.component.html',
  styleUrls: ['./transaction-list-group.component.css'],
})
export class TransactionListGroupComponent {
  @Input() transactions!: Transaction[];
  @Input() displaySeeAll: boolean = false;

  isPositive(amount: number) {
    return Math.sign(amount) == 1;
  }

  addPlusSign(amount: number) {
    return this.isPositive(amount) ? '+' : '';
  }
}
