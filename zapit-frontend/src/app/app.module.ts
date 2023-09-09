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
import { MerchantSettingsComponent } from './user/components/merchant-settings/merchant-settings.component';
import { MerchantHomeComponent } from './merchant/components/merchant-home/merchant-home.component';
import { MerchantViewInvoicesComponent } from './merchant/components/merchant-view-invoices/merchant-view-invoices.component';
import {RxStompService} from "./shared/services/rx-stomp.service";
import {rxStompFactory} from "./shared/factories/rx-stomp.factory";

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
    MerchantSettingsComponent,
    MerchantHomeComponent,
    MerchantViewInvoicesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
      useFactory: rxStompFactory
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
