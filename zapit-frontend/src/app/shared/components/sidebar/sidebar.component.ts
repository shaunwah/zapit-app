import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 's-app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  displayName!: string;
  avatarUrl!: string;

  ngOnInit() {
    const userAuthData = this.authService.getDataFromStorage();
    this.displayName = userAuthData.displayName ?? 'Account';
    this.avatarUrl = `https://www.gravatar.com/avatar/${userAuthData.avatarHash}`;
  }

  isMerchantUser() {
    return this.authService.isMerchantUser();
  }
}
