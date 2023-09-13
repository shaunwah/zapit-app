import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  const routeAfterLogin = (next?: string): {} => {
    if (next) {
      if (route.queryParamMap.keys) {
        let queryParams: string = '?';
        route.queryParamMap.keys.forEach(
          (key) => (queryParams += `${key}=${route.queryParamMap.get(key)}`),
        );
        next += queryParams;
      }
      return {
        queryParams: { next },
      };
    }
    return {};
  };
  // return router.navigate(['/login'], routeAfterLogin(route.url.join('/')));
};
