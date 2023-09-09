import { inject, Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { User } from '../../user/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';

  login(user: User): Observable<User> {
    const authData = btoa(`${user.emailAddress}:${user.password}`)
    const headers = new HttpHeaders().set('Authorization', `Basic ${authData}`);
    return this.http.post<User>(`${this.apiUrl}/login`, null, { headers });
  }

  logout() {
    this.clearDataInStorage();
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  isAuthenticated(): boolean {
    const data = this.getDataFromStorage();
    return data != null && data.accessToken != null && data.username != null;
  }

  setDataInStorage(data: {accessToken: string, username: string}) {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('username', data.username);
  }

  getDataFromStorage() {
    return {
      accessToken: localStorage.getItem('access_token'),
      username: localStorage.getItem('username'),
    };
  }

  clearDataInStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
  }
}
