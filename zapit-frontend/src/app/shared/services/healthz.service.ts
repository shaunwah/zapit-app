import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HealthzService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getHealthz(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/healthz`);
  }
}
