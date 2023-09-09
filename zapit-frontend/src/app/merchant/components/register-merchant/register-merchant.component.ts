import { Component, inject, OnInit } from '@angular/core';
import { MerchantService } from '../../services/merchant.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { Router } from '@angular/router';

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
    this.merchantService
      .createMerchant(this.merchantForm.value)
      .pipe(first())
      .subscribe({
        next: (merchant) =>
          this.router.navigate(['/']).then(() => console.log(merchant)),
        error: (err) => console.error(err.message),
      });
  }
}
