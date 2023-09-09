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
import { MerchantSettingsComponent } from './user/components/merchant-settings/merchant-settings.component';
import {MerchantHomeComponent} from "./merchant/components/merchant-home/merchant-home.component";
import {
  MerchantViewInvoicesComponent
} from "./merchant/components/merchant-view-invoices/merchant-view-invoices.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'settings',
    component: SettingsHomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings/user/appearance',
    component: UserAppearanceSettingsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings/merchant',
    component: MerchantSettingsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings/merchant/enrolment',
    component: RegisterMerchantComponent,
    canActivate: [authGuard],
  },
  {
    path: 'merchant',
    component: MerchantHomeComponent,
    canActivate: [authGuard, merchantUserGuard],
  },
  {
    path: 'merchant/invoices',
    component: MerchantViewInvoicesComponent,
    canActivate: [authGuard, merchantUserGuard],
  },
  {
    path: 'merchant/invoice/new',
    component: CreateInvoiceComponent,
    canActivate: [authGuard, merchantUserGuard],
  },
  { path: 'invoice/:invoiceId/scan', component: ScanInvoiceComponent },
  {
    path: 'invoice/:invoiceId/claim',
    component: ClaimInvoiceComponent,
    canActivate: [authGuard],
  },
  {
    path: 'invoice/:invoiceId',
    component: ViewInvoiceComponent,
    canActivate: [authGuard],
  },
  {
    path: 'invoices',
    component: ViewInvoicesComponent,
    canActivate: [authGuard],
  },
  { path: '', component: HomeComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
