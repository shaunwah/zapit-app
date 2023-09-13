import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { LogoutComponent } from './auth/components/logout/logout.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { HomeComponent } from './home/components/home/home.component';
import { ScanInvoiceComponent } from './invoice/components/scan-invoice/scan-invoice.component';
import { ClaimInvoiceComponent } from './invoice/components/claim-invoice/claim-invoice.component';
import { ViewInvoiceComponent } from './invoice/components/view-invoice/view-invoice.component';
import { RegisterMerchantComponent } from './merchant/components/register-merchant/register-merchant.component';
import { authGuard } from './shared/guards/auth.guard';
import { CreateInvoiceComponent } from './invoice/components/create-invoice/create-invoice.component';
import { merchantUserGuard } from './shared/guards/merchant-user.guard';
import { ViewInvoicesComponent } from './invoice/components/view-invoices/view-invoices.component';
import { UserAppearanceSettingsComponent } from './user/components/user-appearance-settings/user-appearance-settings.component';
import { SettingsHomeComponent } from './user/components/settings-home/settings-home.component';
import { MerchantHomeComponent } from './merchant/components/merchant-home/merchant-home.component';
import { MerchantViewInvoicesComponent } from './merchant/components/merchant-view-invoices/merchant-view-invoices.component';
import { CardsHomeComponent } from './card/components/cards-home/cards-home.component';
import { ViewCardComponent } from './card/components/view-card/view-card.component';
import { SendPaymentCardComponent } from './card/components/send-payment-card/send-payment-card.component';
import { ReceivePaymentCardComponent } from './card/components/receive-payment-card/receive-payment-card.component';
import { SendPaymentCardConfirmComponent } from './card/components/send-payment-card-confirm/send-payment-card-confirm.component';
import { ViewCardsComponent } from './card/components/view-cards/view-cards.component';
import { ViewTransactionComponent } from './transaction/components/view-transaction/view-transaction.component';
import { ViewTransactionsComponent } from './transaction/components/view-transactions/view-transactions.component';
import { ReceivePaymentCardEndComponent } from './card/components/receive-payment-card-end/receive-payment-card-end.component';
import { SendPaymentCardEndComponent } from './card/components/send-payment-card-end/send-payment-card-end.component';
import { UserAccountSettingsComponent } from './user/components/user-account-settings/user-account-settings.component';
import { MerchantDetailsSettingsComponent } from './user/components/merchant-details-settings/merchant-details-settings.component';
import { HealthzComponent } from './shared/components/healthz/healthz.component';

const routes: Routes = [
  { path: 'healthz', component: HealthzComponent, title: 'Healthz' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'logout', component: LogoutComponent, title: 'Logout' },
  { path: 'register', component: RegisterComponent, title: 'Registration' },
  {
    path: 'settings',
    component: SettingsHomeComponent,
    title: 'Settings',
    canActivate: [authGuard],
  },
  {
    path: 'settings/user/appearance',
    component: UserAppearanceSettingsComponent,
    title: 'Appearance Settings',
    canActivate: [authGuard],
  },
  {
    path: 'settings/user/account',
    component: UserAccountSettingsComponent,
    title: 'Appearance Settings',
    canActivate: [authGuard],
  },
  {
    path: 'settings/merchant/details',
    component: MerchantDetailsSettingsComponent,
    title: 'Appearance Settings',
    canActivate: [authGuard, merchantUserGuard],
  },
  {
    path: 'settings/merchant/enrolment',
    component: RegisterMerchantComponent,
    title: 'Merchant Registration',
    canActivate: [authGuard],
  },
  {
    path: 'merchant',
    component: MerchantHomeComponent,
    title: 'Merchant Home',
    canActivate: [authGuard, merchantUserGuard],
  },
  {
    path: 'merchant/invoices',
    component: MerchantViewInvoicesComponent,
    title: 'Merchant Invoices',
    canActivate: [authGuard, merchantUserGuard],
  },
  {
    path: 'merchant/invoice/new',
    component: CreateInvoiceComponent,
    title: 'Invoice Creation',
    canActivate: [authGuard, merchantUserGuard],
  },
  {
    path: 'invoice/:invoiceId/scan',
    component: ScanInvoiceComponent,
    title: 'Receipt Scan',
    canActivate: [merchantUserGuard],
  },
  {
    path: 'invoice/:invoiceId/claim',
    component: ClaimInvoiceComponent,
    title: 'Receipt Claim',
    canActivate: [authGuard],
  },
  {
    path: 'invoice/:invoiceId',
    component: ViewInvoiceComponent,
    title: 'Receipt',
    canActivate: [authGuard],
  },
  {
    path: 'invoices',
    component: ViewInvoicesComponent,
    title: 'Receipts',
    canActivate: [authGuard],
  },
  {
    path: 'wallet',
    component: CardsHomeComponent,
    title: 'Wallet',
    canActivate: [authGuard],
  },
  {
    path: 'cards',
    component: ViewCardsComponent,
    title: 'Cards',
    canActivate: [authGuard],
  },
  {
    path: 'card/:cardId',
    component: ViewCardComponent,
    title: 'Card',
    canActivate: [authGuard],
  },
  {
    path: 'card/:cardId/send',
    component: SendPaymentCardComponent,
    title: 'Payment Transfer',
    canActivate: [authGuard],
  },
  {
    path: 'card/:cardId/receive',
    component: ReceivePaymentCardComponent,
    title: 'Payment Transfer',
    canActivate: [authGuard, merchantUserGuard],
  },
  {
    path: 'card/:cardId/send/confirm',
    component: SendPaymentCardConfirmComponent,
    title: 'Payment Transfer',
    canActivate: [authGuard],
  },
  {
    path: 'card/:cardId/receive/complete',
    component: ReceivePaymentCardEndComponent,
    title: 'Payment Transfer',
    canActivate: [authGuard, merchantUserGuard],
  },
  {
    path: 'card/:cardId/send/complete',
    component: SendPaymentCardEndComponent,
    title: 'Payment Transfer',
    canActivate: [authGuard],
  },
  {
    path: 'transactions',
    component: ViewTransactionsComponent,
    title: 'Transactions',
    canActivate: [authGuard],
  },
  {
    path: 'transaction/:transactionId',
    component: ViewTransactionComponent,
    title: 'Transaction',
    canActivate: [authGuard],
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
