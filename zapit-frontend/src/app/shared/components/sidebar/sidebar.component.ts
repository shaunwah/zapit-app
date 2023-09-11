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

  ngOnInit() {
    this.displayName = this.authService.getDataFromStorage().displayName || 'Account';
  }
}
