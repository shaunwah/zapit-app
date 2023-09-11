import {Component, inject, OnInit, ViewChild} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import {Router} from "@angular/router";
import {AlertComponent} from "../../../shared/components/alert/alert.component";

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
        email: this.fb.control<string>('', [Validators.required, Validators.email]),
        displayName: this.fb.control<string>('', [Validators.required]),
        password: this.fb.control<string>('', [Validators.required]),
        passwordConfirm: this.fb.control<string>('', [Validators.required]),
      },
      {
        validators: this.passwordConfirmValidator,
      },
    );
  }

  register() {
    this.authService
      .register(this.formatPayload(this.registerForm.value))
      .pipe(first())
      .subscribe({
        next: () => this.router.navigate(['/login']).then(() => {}),
        error: (err) => {
          this.alertComponent.visible = true;
          this.alertComponent.message = err.message;
        },
      });
  }

  private formatPayload(data: any) {
    delete data.passwordConfirm;
    return data;
  }

  private passwordConfirmValidator(control: AbstractControl) {
    return control.value.password === control.value.passwordConfirm
      ? null
      : ({ passwordsDoNotMatch: { value: 'error' } } as ValidationErrors);
  }

  get email() {
    return this.registerForm.get('email')!;
  }

  get displayName() {
    return this.registerForm.get('displayName')!;
  }

  get password() {
    return this.registerForm.get('password')!;
  }

  get passwordConfirm() {
    return this.registerForm.get('passwordConfirm')!;
  }
}
