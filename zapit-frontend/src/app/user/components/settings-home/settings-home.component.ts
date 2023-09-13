import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-settings-home',
  templateUrl: './settings-home.component.html',
  styleUrls: ['./settings-home.component.css'],
})
export class SettingsHomeComponent {
  private authService = inject(AuthService);

  isMerchantUser() {
    return this.authService.isMerchantUser();
  }
}
