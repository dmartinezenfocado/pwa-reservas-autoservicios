import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const tokenGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  try {
    await auth.ensureToken();
    return true;
  } catch {
    return false;
  }
};
