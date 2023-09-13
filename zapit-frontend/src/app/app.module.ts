import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/components/login/login.component';
import { LogoutComponent } from './auth/components/logout/logout.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/components/home/home.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { ScanInvoiceComponent } from './invoice/components/scan-invoice/scan-invoice.component';
import { ClaimInvoiceComponent } from './invoice/components/claim-invoice/claim-invoice.component';
import { JwtModule } from '@auth0/angular-jwt';
import { ReceiptComponent } from './shared/components/receipt/receipt.component';
import { ViewInvoiceComponent } from './invoice/components/view-invoice/view-invoice.component';
import { RegisterMerchantComponent } from './merchant/components/register-merchant/register-merchant.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { CreateInvoiceComponent } from './invoice/components/create-invoice/create-invoice.component';
import { ViewInvoicesComponent } from './invoice/components/view-invoices/view-invoices.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ServiceWorkerModule } from '@angular/service-worker';
import { InvoiceListGroupComponent } from './shared/components/invoice-list-group/invoice-list-group.component';
import { UserAppearanceSettingsComponent } from './user/components/user-appearance-settings/user-appearance-settings.component';
import { SettingsHomeComponent } from './user/components/settings-home/settings-home.component';
import { MerchantDetailsSettingsComponent } from './user/components/merchant-details-settings/merchant-details-settings.component';
import { MerchantHomeComponent } from './merchant/components/merchant-home/merchant-home.component';
import { MerchantViewInvoicesComponent } from './merchant/components/merchant-view-invoices/merchant-view-invoices.component';
import { RxStompService } from './shared/services/rx-stomp.service';
import { rxStompFactory } from './shared/factories/rx-stomp.factory';
import { CardsHomeComponent } from './card/components/cards-home/cards-home.component';
import { ViewCardComponent } from './card/components/view-card/view-card.component';
import { CardComponent } from './shared/components/card/card.component';
import { CardPlaceholderComponent } from './shared/components/card-placeholder/card-placeholder.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SendPaymentCardComponent } from './card/components/send-payment-card/send-payment-card.component';
import { ReceivePaymentCardComponent } from './card/components/receive-payment-card/receive-payment-card.component';
import { SendPaymentCardConfirmComponent } from './card/components/send-payment-card-confirm/send-payment-card-confirm.component';
import { TransactionListGroupComponent } from './shared/components/transaction-list-group/transaction-list-group.component';
import { ViewTransactionsComponent } from './transaction/components/view-transactions/view-transactions.component';
import { ViewCardsComponent } from './card/components/view-cards/view-cards.component';
import { ViewTransactionComponent } from './transaction/components/view-transaction/view-transaction.component';
import { CardListGroupComponent } from './shared/components/card-list-group/card-list-group.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { SendPaymentCardEndComponent } from './card/components/send-payment-card-end/send-payment-card-end.component';
import { ReceivePaymentCardEndComponent } from './card/components/receive-payment-card-end/receive-payment-card-end.component';
import { UserAccountSettingsComponent } from './user/components/user-account-settings/user-account-settings.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    HomeComponent,
    AlertComponent,
    ScanInvoiceComponent,
    ClaimInvoiceComponent,
    ReceiptComponent,
    ViewInvoiceComponent,
    RegisterMerchantComponent,
    SidebarComponent,
    NavbarComponent,
    CreateInvoiceComponent,
    ViewInvoicesComponent,
    InvoiceListGroupComponent,
    UserAppearanceSettingsComponent,
    SettingsHomeComponent,
    MerchantDetailsSettingsComponent,
    MerchantHomeComponent,
    MerchantViewInvoicesComponent,
    CardsHomeComponent,
    ViewCardComponent,
    CardComponent,
    CardPlaceholderComponent,
    SendPaymentCardComponent,
    ReceivePaymentCardComponent,
    SendPaymentCardConfirmComponent,
    TransactionListGroupComponent,
    ViewTransactionsComponent,
    ViewCardsComponent,
    ViewTransactionComponent,
    CardListGroupComponent,
    PaginationComponent,
    SendPaymentCardEndComponent,
    ReceivePaymentCardEndComponent,
    UserAccountSettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['example.com'],
      },
    }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    QRCodeModule,
  ],
  providers: [
    {
      provide: RxStompService,
      useFactory: rxStompFactory,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
