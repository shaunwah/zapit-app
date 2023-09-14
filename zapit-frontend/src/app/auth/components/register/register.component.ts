import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { User } from '../../../user/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  @ViewChild('alertComponent') alertComponent!: AlertComponent;
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  registerForm!: FormGroup;

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        email: this.fb.control<string>('', [
          Validators.required,
          Validators.email,
          Validators.maxLength(128),
        ]),
        displayName: this.fb.control<string>('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(32),
        ]),
        password: this.fb.control<string>('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(64),
        ]),
        passwordConfirm: this.fb.control<string>('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(64),
        ]),
      },
      {
        validators: this.passwordConfirmValidator,
      },
    );
  }

  onSubmit() {
    this.register(this.formatPayload(this.registerForm.value));
  }

  register(user: User) {
    this.authService
      .register(user)
      .pipe(first())
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => {
          this.alertComponent.visible = true;
          this.alertComponent.message = err.message;
        },
      });
  }

  private formatPayload(data: any) {
    delete data.passwordConfirm;
    return data as User;
  }

  private passwordConfirmValidator(control: AbstractControl) {
    return control.value.password === control.value.passwordConfirm
      ? null
      : ({ passwordsDoNotMatch: { value: 'error' } } as ValidationErrors);
  }

  get email() {
    return this.registerForm.get('email') as FormControl;
  }

  get displayName() {
    return this.registerForm.get('displayName') as FormControl;
  }

  get password() {
    return this.registerForm.get('password') as FormControl;
  }

  get passwordConfirm() {
    return this.registerForm.get('passwordConfirm') as FormControl;
  }
}
