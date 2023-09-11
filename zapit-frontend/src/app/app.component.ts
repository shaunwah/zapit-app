import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "./auth/services/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ThemeService} from "./shared/services/theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private router = inject(Router);
  title = 'Zapit';
  navClass = 'main-with-sidebar pt-3 pt-md-4';

  ngOnInit() {
    this.themeService.modifyHtmlElement();
  }

  displayNavs() {
    return !(
      this.router.url.trim().toLowerCase() == '/login' ||
      this.router.url.trim().toLowerCase() == '/logout' ||
      this.router.url.trim().toLowerCase() == '/register' ||
      (this.router.url.trim().toLowerCase().includes('/invoice') && this.router.url.trim().toLowerCase().includes('/scan'))
    );
  }
}
