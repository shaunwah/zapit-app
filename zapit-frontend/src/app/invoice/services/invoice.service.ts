import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../invoice';
import { LocationData } from '../../shared/interfaces/location-data';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api';

  getInvoiceById(invoiceId: string, timestamp?: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/invoice/${invoiceId}`, {
      params: { t: timestamp! },
    });
  }

  getInvoicesTotalByUserId(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/invoices/total`);
  }

  getInvoicesByUserId(
    limit: number = 5,
    offset: number = 0,
  ): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`, {
      params: { limit, offset },
    });
  }

  getInvoicesByMerchantId(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/merchant/invoices`);
  }

  getInvoicesByMerchantIdAndUserId(
    merchantId: number,
    exclude: string,
  ): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(
      `${this.apiUrl}/merchant/${merchantId}/invoices`,
      {
        params: { exclude },
      },
    );
  }

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/invoices`, invoice);
  }

  claimInvoice(
    invoiceId: string,
    timestamp: number,
    locationData?: LocationData,
  ): Observable<Invoice> {
    return this.http.post<Invoice>(
      `${this.apiUrl}/invoice/${invoiceId}`,
      locationData,
      {
        params: { t: timestamp },
      },
    );
  }
}
