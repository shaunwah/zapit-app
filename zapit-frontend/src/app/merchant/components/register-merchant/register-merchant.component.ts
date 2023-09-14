import { Component, inject, OnInit } from '@angular/core';
import { MerchantService } from '../../services/merchant.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { Merchant } from '../../merchant';
import { AuthService } from '../../../auth/services/auth.service';
import { UserAuthData } from '../../../shared/interfaces/user-auth-data';

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css'],
})
export class RegisterMerchantComponent implements OnInit {
  private merchantService = inject(MerchantService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  merchantForm!: FormGroup;

  ngOnInit() {
    this.merchantForm = this.fb.group({
      name: this.fb.control<string>('', [
        Validators.required,
        Validators.maxLength(64),
      ]),
      website: this.fb.control<string>('', [
        Validators.required,
        Validators.pattern(
          '[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)',
        ),
      ]),
      address: this.fb.control<string>('', [Validators.required]),
      postCode: this.fb.control<string>('', [
        Validators.required,
        Validators.maxLength(64),
      ]),
    });
  }

  onSubmit() {
    this.createMerchant(this.merchantForm.value);
  }

  createMerchant(merchant: Merchant) {
    this.merchantService
      .createMerchant(merchant)
      .pipe(first())
      .subscribe({
        next: () => {
          const data = this.getDataFromStorage();
          data.roles = 'ROLE_MERCHANT';
          this.setDataInStorage(data);
          return this.router.navigate(['/']);
        },
        error: (err) => console.error(err.message),
      });
  }

  setDataInStorage(data: UserAuthData) {
    this.authService.setDataInStorage(data);
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('display_name', data.displayName);
    localStorage.setItem('avatar_hash', data.avatarHash);
    localStorage.setItem('roles', 'ROLE_MERCHANT');
  }

  getDataFromStorage() {
    return this.authService.getDataFromStorage();
  }

  get name() {
    return this.merchantForm.get('name') as FormControl;
  }

  get website() {
    return this.merchantForm.get('website') as FormControl;
  }

  get address() {
    return this.merchantForm.get('address') as FormControl;
  }

  get postCode() {
    return this.merchantForm.get('postCode') as FormControl;
  }
}
