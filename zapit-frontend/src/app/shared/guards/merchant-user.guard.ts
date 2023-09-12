import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

export const merchantUserGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.getDataFromStorage().roles === 'ROLE_MERCHANT';
};
