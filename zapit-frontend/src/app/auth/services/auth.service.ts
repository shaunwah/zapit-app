import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from '../../user/user';
import { Observable } from 'rxjs';
import { UserAuthData } from '../../shared/interfaces/user-auth-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';

  login(user: User): Observable<User> {
    const authData = btoa(`${user.email}:${user.password}`);
    const headers = new HttpHeaders().set('Authorization', `Basic ${authData}`);
    return this.http.post<User>(`${this.apiUrl}/login`, null, { headers });
  }

  logout(): void {
    this.clearDataInStorage();
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  isAuthenticated(): boolean {
    const data = this.getDataFromStorage() as UserAuthData;
    return (
      data != null &&
      data.accessToken != null &&
      data.displayName != null &&
      data.roles != null
    );
  }

  isMerchantUser(): boolean {
    return (
      (this.getDataFromStorage() as UserAuthData).roles === 'ROLE_MERCHANT'
    );
  }

  setDataInStorage(data: UserAuthData): void {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('display_name', data.displayName);
    localStorage.setItem('roles', data.roles);
  }

  getDataFromStorage(): UserAuthData {
    return {
      accessToken: localStorage.getItem('access_token'),
      displayName: localStorage.getItem('display_name'),
      roles: localStorage.getItem('roles'),
    } as UserAuthData;
  }

  clearDataInStorage(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('display_name');
    localStorage.removeItem('roles');
  }
}
