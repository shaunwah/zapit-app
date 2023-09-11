import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Card} from "../card";
import {LocationData} from "../../shared/interfaces/location-data";
import {Transaction} from "../../transaction/transaction";

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private http = inject(HttpClient);
  readonly apiUrl = "/api";

  getCardsByUserId(limit: number, offset?: number): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/cards`, { params: { limit, offset: offset ?? 0 } })
  }

  getCardById(cardId: string): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/card/${cardId}`);
  }

  addToCard(cardId: string, amount: number, locationData?: LocationData): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/card/${cardId}/add`, locationData, { params: { amt: amount } })
  }

  deductFromCard(cardId: string, amount: number, locationData?: LocationData): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/card/${cardId}/deduct`, locationData, { params: { amt: amount } })
  }
}