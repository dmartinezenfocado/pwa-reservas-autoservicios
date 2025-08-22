import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ConfigService } from '../services/config.service';

export const configGuard: CanActivateFn = () => {
  const cfg = inject(ConfigService);
  const router = inject(Router);
  if (cfg.hasConfig()) return true;
  router.navigate(['/config']);
  return false;
};
