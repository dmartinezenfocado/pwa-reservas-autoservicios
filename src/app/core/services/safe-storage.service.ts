import { Injectable, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SafeStorageService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  getItem(key: string): string | null {
    if (!this.isBrowser) return null;
    try { return window.localStorage.getItem(key); }
    catch { return null; }
  }

  setItem(key: string, value: string): void {
    if (!this.isBrowser) return;
    try { window.localStorage.setItem(key, value); } catch {}
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;
    try { window.localStorage.removeItem(key); } catch {}
  }
}
