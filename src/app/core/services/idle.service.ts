import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

let timer: any;

@Injectable({ providedIn: 'root' })
export class IdleService {
  private router = inject(Router);
  private bound = false;

  attach() {
    if (this.bound) return;
    this.bound = true;
    ['click','mousemove','keydown','touchstart'].forEach(evt =>
      window.addEventListener(evt, () => this.reset())
    );
    this.reset();
  }

  reset() {
    clearTimeout(timer);
    timer = setTimeout(
      () => this.router.navigateByUrl('/screensaver'),
      environment.idleSeconds * 1000
    );
  }
}
