import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  readonly bootstrapThemeAttribute = 'data-bs-theme';

  toggleDarkMode(toggle: boolean) {
    if (toggle) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.removeItem('theme');
    }
  }

  isDarkModeEnabled() {
    return localStorage.getItem('theme') == 'dark';
  }

  modifyHtmlElement() {
    const THEME = localStorage.getItem('theme');
    if (THEME) {
      document.querySelector('html')?.setAttribute(this.bootstrapThemeAttribute, THEME);
    }
  }
}
