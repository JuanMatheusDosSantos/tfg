import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../auth/auth';
import {map} from 'rxjs';

export const parkGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si no hay token ni siquiera esperamos
  if (!authService.getAccessToken()) {
    router.navigate(['/']);
    return false;
  }

  // Esperamos a tener el usuario cargado antes de decidir
  return authService.waitForUser().pipe(
    map(user => {
      if (user && ((user as any).role === 'admin'||(user as any).role==="park")) {
        return true;
      }
      router.navigate(['/']);
      return false;
    })
  );
};
