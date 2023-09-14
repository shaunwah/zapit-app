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
import { User } from '../../../user/user';
import { UserAuthData } from '../../../shared/interfaces/user-auth-data';

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
  redirectToRouteOnLogin?: string | null;

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
    this.redirectToRouteOnLogin = this.route.snapshot.queryParamMap.get('next');
  }

  onSubmit() {
    this.authService.logout();
    return this.login(this.loginForm.value);
  }

  login(user: User) {
    this.authService
      .login(user)
      .pipe(first())
      .subscribe({
        next: (data: any) => {
          this.setDataInStorage(data);
          if (this.redirectToRouteOnLogin) {
            const routeData = this.getRouteDataFromNext(
              this.redirectToRouteOnLogin,
            );
            return this.router.navigate(routeData.route, {
              queryParams: routeData.queryParams,
            });
          }
          return this.router.navigate(['/']);
        },
        error: () => {
          this.alertComponent.visible = true;
          this.alertComponent.message = 'Invalid email and/or password';
        },
      });
  }

  setDataInStorage(data: UserAuthData) {
    this.authService.setDataInStorage(data);
  }

  getRouteDataFromNext(next: string) {
    const regex = /\?.+/g;
    const route = decodeURIComponent(next).split('/');
    const queryParams: any = {}; // TODO to optimise
    console.log(route[route.length - 1]);
    let queryParamsFromNext = route[route.length - 1].match(regex);
    if (queryParamsFromNext && queryParamsFromNext.length > 0) {
      route[route.length - 1]
        .match(regex)![0]
        .substring(1)
        .split('&')
        .forEach((queryParam) => {
          const splitQueryParam = queryParam.split('=');
          queryParams[splitQueryParam[0]] = splitQueryParam[1];
        });
      route[route.length - 1] = route[route.length - 1].replace(regex, '');
    }
    return {
      route: ['/', ...route],
      queryParams,
    };
  }

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }
}
