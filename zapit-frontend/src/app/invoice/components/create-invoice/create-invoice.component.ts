import { Component, DoCheck, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../invoice';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { MerchantService } from '../../../merchant/services/merchant.service';
import { Merchant } from '../../../merchant/merchant';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.css'],
})
export class CreateInvoiceComponent implements OnInit, DoCheck {
  private invoiceService = inject(InvoiceService);
  private merchantService = inject(MerchantService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  invoice!: Invoice;
  merchant!: Merchant;
  invoiceForm!: FormGroup;

  ngOnInit() {
    this.invoiceForm = this.fb.group({
      identifier: this.fb.control<string>('', [
        Validators.required,
        Validators.maxLength(64),
      ]),
      invoiceItems: this.fb.array([]),
      salesTax: this.fb.control<number>(8, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      additionalCharges: this.fb.control<number>(0, [Validators.min(0)]),
      eligiblePoints: this.fb.control<number>(0, [
        Validators.required,
        Validators.min(0),
      ]),
    });
    this.getMerchantByUserId();
    this.onAddInvoiceItem();
  }

  ngDoCheck() {
    this.invoice = {
      ...this.invoiceForm.value,
      salesTax: (this.invoiceForm.value as Invoice).salesTax / 100,
      total: this.calculateTotal(this.invoiceForm.value as Invoice),
      issuedBy: this.merchant,
      createdOn: Date.now(),
    };
  }

  onSubmit() {
    this.invoiceService
      .createInvoice(this.invoice)
      .pipe(first())
      .subscribe({
        next: (invoice) =>
          this.router.navigate(['/invoice', (invoice as any).invoice]),
        error: (err) => console.error(err.message),
      });
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

  onAddInvoiceItem() {
    const invoiceItemsForm: FormGroup = this.fb.group({
      identifier: this.fb.control<string>('', [Validators.maxLength(64)]),
      name: this.fb.control<string>('', [
        Validators.required,
        Validators.maxLength(64),
      ]),
      quantity: this.fb.control<number>(1, [
        Validators.required,
        Validators.min(1),
      ]),
      unitPrice: this.fb.control<number>(1, [
        Validators.required,
        Validators.min(0.01),
      ]),
    });
    this.invoiceItems.push(invoiceItemsForm);
  }

  onRemoveInvoiceItem(index: number) {
    this.invoiceItems.removeAt(index);
  }

  calculateTotal(invoice: Invoice) {
    const itemsTotal = invoice.invoiceItems!.reduce(
      (acc, current) => acc + current.quantity * current.unitPrice,
      0,
    );
    return itemsTotal + invoice.additionalCharges;
  }

  get identifier() {
    return this.invoiceForm.get('identifier') as FormControl;
  }

  get invoiceItems() {
    return this.invoiceForm.get('invoiceItems') as FormArray;
  }

  get salesTax() {
    return this.invoiceForm.get('salesTax') as FormControl;
  }

  get additionalCharges() {
    return this.invoiceForm.get('additionalCharges') as FormControl;
  }

  get eligiblePoints() {
    return this.invoiceForm.get('eligiblePoints') as FormControl;
  }
}
