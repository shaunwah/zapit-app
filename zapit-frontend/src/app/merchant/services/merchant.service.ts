import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Merchant} from "../merchant";

@Injectable({
  providedIn: 'root'
})
export class MerchantService {
  private http = inject(HttpClient);
  readonly apiUrl = '/api'

  getMerchantById(merchantId: number): Observable<Merchant> {
    return this.http.get<Merchant>(`${this.apiUrl}/merchant/${merchantId}`);
  }

  getMerchantByUserId(): Observable<Merchant> {
    return this.http.get<Merchant>(`${this.apiUrl}/merchant`);
  }

  createMerchant(merchant: Merchant): Observable<Merchant> {
    return this.http.post<Merchant>(`${this.apiUrl}/merchants`, merchant);
  }

  updateMerchant(merchant: Merchant): Observable<Merchant> {
    return this.http.put<Merchant>(`${this.apiUrl}/merchants`, merchant);
  }
}
