import { Injectable, signal } from '@angular/core';
import { KioskConfig } from '../models/config.model';
import { SafeStorageService } from './safe-storage.service';

const LS_KEY = 'reservas.kiosk.config';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  // ⚠️ No llames localStorage en inicializadores de propiedades sin chequear entorno
  configSig = signal<KioskConfig | null>(null);

  constructor(private store: SafeStorageService) {
    this.configSig.set(this.load());
  }

  private load(): KioskConfig | null {
    const raw = this.store.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as KioskConfig) : null;
  }

  save(cfg: KioskConfig) {
    this.store.setItem(LS_KEY, JSON.stringify(cfg));
    this.configSig.set(cfg);
  }

  hasConfig() { return !!this.configSig(); }

  async importFromFile(file: File) {
    const text = await file.text();
    const cfg = JSON.parse(text) as KioskConfig;
    this.save(cfg);
  }
}
