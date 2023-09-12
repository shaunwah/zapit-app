import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 's-app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private authService = inject(AuthService);
  avatarUrl!: string;

  ngOnInit() {
    const userAuthData = this.authService.getDataFromStorage();
    this.avatarUrl = `https://www.gravatar.com/avatar/${userAuthData.avatarHash}`;
  }

  isMerchantUser() {
    return this.authService.isMerchantUser();
  }
}
