import { Injectable, signal } from '@angular/core';
import { KioskConfig } from '../models/config.model';

const LS_KEY = 'reservas.kiosk.config';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  configSig = signal<KioskConfig | null>(this.load());

  private load(): KioskConfig | null {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) as KioskConfig : null;
  }

  save(cfg: KioskConfig) {
    localStorage.setItem(LS_KEY, JSON.stringify(cfg));
    this.configSig.set(cfg);
  }

  hasConfig() { return !!this.configSig(); }

  async importFromFile(file: File) {
    const text = await file.text();
    const cfg = JSON.parse(text) as KioskConfig;
    this.save(cfg);
  }
}
