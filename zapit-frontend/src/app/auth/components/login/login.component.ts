import {
  AfterContentChecked,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterContentChecked {
  @ViewChild('alertComponent') alertComponent!: AlertComponent;
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  loginForm!: FormGroup;
  redirectToRouteOnLogin?: string;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: this.fb.control<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.fb.control<string>('', [Validators.required]),
    });
  }

  ngAfterContentChecked() {
    this.redirectToRouteOnLogin = String(
      this.route.snapshot.queryParamMap.get('next'),
    );
  }

  onLogin() {
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
          if (this.redirectToRouteOnLogin) {
            const route = decodeURIComponent(this.redirectToRouteOnLogin).split(
              '/',
            );
            const queryParams: any = {}; // TODO to optimise
            route[route.length - 1]
              .match(/\?.+/g)![0]
              .substring(1)
              .split('&')
              .forEach((queryParam) => {
                const splitQueryParam = queryParam.split('=');
                queryParams[splitQueryParam[0]] = splitQueryParam[1];
              });
            route[route.length - 1] = route[route.length - 1].replace(
              /\?.+/g,
              '',
            );
            return this.router.navigate(['/', ...route], { queryParams });
          }
          return this.router.navigate(['/']);
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
