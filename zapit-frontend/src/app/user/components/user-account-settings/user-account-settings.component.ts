import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../user';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-account-settings',
  templateUrl: './user-account-settings.component.html',
  styleUrls: ['./user-account-settings.component.css'],
})
export class UserAccountSettingsComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  user!: User;
  userForm!: FormGroup;

  ngOnInit() {
    this.userForm = this.fb.group(
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
          Validators.minLength(6),
          Validators.maxLength(64),
        ]),
        passwordConfirm: this.fb.control<string>('', [
          Validators.minLength(6),
          Validators.maxLength(64),
        ]),
        firstName: this.fb.control<string>('', [Validators.maxLength(64)]),
        lastName: this.fb.control<string>('', [Validators.maxLength(64)]),
      },
      {
        validators: this.passwordConfirmValidator,
      },
    );
    this.getUserById();
  }

  onSubmit() {
    this.updateUser(this.formatPayload(this.userForm.value));
  }

  getUserById() {
    this.userService
      .getUserById()
      .pipe(first())
      .subscribe({
        next: (user) => {
          this.user = user;
          this.userForm.patchValue(user);
          return this.router.navigate(['/settings']);
        },
        error: (err) => console.error(err.message),
      });
  }

  updateUser(user: User) {
    this.userService
      .updateUser(user)
      .pipe(first())
      .subscribe({
        next: (user) => {
          let userAuthData = this.authService.getDataFromStorage();
          userAuthData.displayName = this.displayName.value;
          this.authService.setDataInStorage(userAuthData); // TODO update name in sidebar
        },
        error: (err) => console.error(err.message),
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
    return this.userForm.get('email') as FormControl;
  }
  get displayName() {
    return this.userForm.get('displayName') as FormControl;
  }
  get password() {
    return this.userForm.get('password') as FormControl;
  }
  get passwordConfirm() {
    return this.userForm.get('passwordConfirm') as FormControl;
  }
  get firstName() {
    return this.userForm.get('firstName') as FormControl;
  }
  get lastName() {
    return this.userForm.get('lastName') as FormControl;
  }
}
