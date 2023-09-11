import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('alertComponent') alertComponent!: AlertComponent;
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: this.fb.control<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.fb.control<string>('', [Validators.required]),
    });
  }

  login() {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    }
    this.authService
      .login(this.loginForm.value)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.authService.setDataInStorage({
            accessToken: data.token,
            displayName: data.displayName,
          });
          this.router.navigate(['/']).then(() => {}); // TODO
        },
        error: () => {
          this.alertComponent.visible = true;
          this.alertComponent.message = 'Invalid email and/or password';
        },
      });
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
}
