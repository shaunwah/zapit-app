import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction } from '../transaction';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private http = inject(HttpClient);
  readonly apiUrl = 'api';

  getTransactionsByCardId(
    cardId: string,
    limit: number = 5,
    offset: number = 0,
  ): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.apiUrl}/card/${cardId}/transactions`,
      {
        params: { limit, offset },
      },
    );
  }

  getTransactionsByUserId(
    limit: number = 5,
    offset: number = 0,
  ): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`, {
      params: { limit, offset },
    });
  }

  getTransactionById(transactionId: number): Observable<Transaction> {
    return this.http.get<Transaction>(
      `${this.apiUrl}/transaction/${transactionId}`,
    );
  }

  getTransactionsTotalByUserId(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/transactions/total`);
  }
}
