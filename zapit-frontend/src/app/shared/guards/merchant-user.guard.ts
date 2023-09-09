import { CanActivateFn } from '@angular/router';

export const merchantUserGuard: CanActivateFn = (route, state) => {
  return true;
};
