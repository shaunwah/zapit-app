import { Component, inject, OnInit } from '@angular/core';
import { MerchantService } from '../../services/merchant.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      name: this.fb.control<string>('', [Validators.required]),
      website: this.fb.control<string>(''),
      address: this.fb.control<string>('', [Validators.required]),
      postCode: this.fb.control<string>('', [Validators.required]),
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
          this.setDataInStorage(this.getDataFromStorage());
          return this.router.navigate(['/']);
        },
        error: (err) => console.error(err.message),
      });
  }

  setDataInStorage(data: UserAuthData) {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('display_name', data.displayName);
    localStorage.setItem('roles', 'ROLE_MERCHANT');
  }

  getDataFromStorage() {
    return this.authService.getDataFromStorage();
  }
}
