import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HealthzService {
  private http = inject(HttpClient);

  getHealthz(): Observable<string> {
    return this.http.get<string>('/healthz');
  }

  getApiHealthz(): Observable<string> {
    return this.http.get<string>('/api/healthz');
  }
}
