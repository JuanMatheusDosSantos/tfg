import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {Auth} from './auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);
  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user:User;
}
export interface User {
  id: number;
  name: string;
  email: string;
}
