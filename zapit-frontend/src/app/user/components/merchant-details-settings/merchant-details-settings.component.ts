import { Component, inject, OnInit } from '@angular/core';
import { MerchantService } from '../../../merchant/services/merchant.service';
import { Merchant } from '../../../merchant/merchant';
import { first } from 'rxjs';

@Component({
  selector: 'app-merchant-details-settings',
  templateUrl: './merchant-details-settings.component.html',
  styleUrls: ['./merchant-details-settings.component.css'],
})
export class MerchantDetailsSettingsComponent implements OnInit {
  private merchantService = inject(MerchantService);
  merchant!: Merchant;

  ngOnInit() {
    this.getMerchantByUserId();
  }

  getMerchantByUserId() {
    this.merchantService
      .getMerchantByUserId()
      .pipe(first())
      .subscribe({
        next: (merchant) => (this.merchant = merchant),
        error: (err) => console.error(err.message),
      });
  }
}
