import {Component, inject, OnInit} from '@angular/core';
import {ThemeService} from "../../../shared/services/theme.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-appearance-settings',
  templateUrl: './user-appearance-settings.component.html',
  styleUrls: ['./user-appearance-settings.component.css'],
})
export class UserAppearanceSettingsComponent implements OnInit {
  private themeService = inject(ThemeService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  userSettingsForm!: FormGroup;

  ngOnInit() {
    this.userSettingsForm = this.fb.group({
      darkMode: this.fb.control<boolean>(this.themeService.isDarkModeEnabled())
    })
  }

  onSubmit() {
    this.themeService.toggleDarkMode(this.userSettingsForm.value.darkMode);
    window.location.reload();
  }
}
