import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Merchant } from '../merchant';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

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
