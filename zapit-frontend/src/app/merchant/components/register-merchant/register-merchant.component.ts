import { Component, inject, OnInit } from '@angular/core';
import { MerchantService } from '../../services/merchant.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { Merchant } from '../../merchant';

@Component({
  selector: 'app-register-merchant',
  templateUrl: './register-merchant.component.html',
  styleUrls: ['./register-merchant.component.css'],
})
export class RegisterMerchantComponent implements OnInit {
  private merchantService = inject(MerchantService);
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
        next: () => this.router.navigate(['/']),
        error: (err) => console.error(err.message),
      });
  }
}
