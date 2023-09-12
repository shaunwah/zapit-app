import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const merchantUserGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isMerchantUser()) {
    return true;
  }

  return router.navigate(['/'], { queryParams: { isMerchant: false } });
};
