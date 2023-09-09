import { Component, DoCheck, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../invoice';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import {MerchantService} from "../../../merchant/services/merchant.service";
import {Merchant} from "../../../merchant/merchant";

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
    this.merchantService.getMerchantByUserId()
      .pipe(first())
      .subscribe({
        next: merchant => this.merchant = merchant,
        error: err => console.error(err.message)
      })
    this.invoiceForm = this.fb.group({
      identifier: this.fb.control<string>(''),
      invoiceItems: this.fb.array([]),
      salesTax: this.fb.control<number>(0.08),
      additionalCharges: this.fb.control<number>(0),
    });
    this.onAddInvoiceItem();
  }

  ngDoCheck() {
    this.invoice = {
      ...this.invoiceForm.value,
      total: this.calculateTotal(this.invoiceForm.value as Invoice),
      issuedBy: this.merchant,
      createdOn: Date.now(),
    };
  }

  calculateTotal(invoice: Invoice) {
    const itemsTotal = invoice.invoiceItems!.reduce(
      (acc, current) => acc + current.quantity * current.unitPrice,
      0,
    );
    return itemsTotal + invoice.additionalCharges;
  }

  onSubmit() {
    this.invoiceService
      .createInvoice(this.invoice)
      .pipe(first())
      .subscribe({
        next: (invoice) =>
          this.router.navigate(['/invoice', (invoice as any).invoice]).then(() => console.log(invoice)),
        error: (err) => console.error(err.message),
      });
  }

  onAddInvoiceItem() {
    const invoiceItemsForm: FormGroup = this.fb.group({
      identifier: this.fb.control<string>(''),
      name: this.fb.control<string>(''),
      quantity: this.fb.control<number>(1),
      unitPrice: this.fb.control<number>(1),
    });
    this.invoiceItems.push(invoiceItemsForm);
  }

  onRemoveInvoiceItem(index: number) {
    this.invoiceItems.removeAt(index);
  }

  get invoiceItems() {
    return this.invoiceForm.get('invoiceItems') as FormArray;
  }
}
