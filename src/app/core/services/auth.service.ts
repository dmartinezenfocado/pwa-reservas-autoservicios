import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ConfigService } from './config.service';
import { lastValueFrom, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { SafeStorageService } from './safe-storage.service';
import type { KioskConfig } from '../models/config.model';

interface AuthResponse { access_token: string; expires_in?: number; }
const LS_TOKEN = 'reservas.kiosk.token';
const LS_TOKEN_EXP = 'reservas.kiosk.tokenExp';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null;
  private tokenExp: number;

  constructor(
    private http: HttpClient,
    private cfg: ConfigService,
    private store: SafeStorageService
  ) {
    this.token = this.store.getItem(LS_TOKEN);
    this.tokenExp = Number(this.store.getItem(LS_TOKEN_EXP) || 0);
  }

  getToken() { return this.token; }
  private isExpired() { return !this.token || Date.now() > this.tokenExp; }

  async ensureToken() {
    if (!this.isExpired()) return this.token;

    const c = this.cfg.configSig();
    if (!c) throw new Error('Sin configuración');

    const useMock = (environment as any).auth?.mock ?? true;

    const res = useMock
      ? await this.fetchTokenViaMock(c)
      : await this.fetchTokenViaHttp(c);

    if (!res?.access_token) throw new Error('No se pudo obtener token');

    this.token = res.access_token;
    const ttlMs = ((environment as any).auth?.tokenTtlSeconds ?? res.expires_in ?? 24 * 3600) * 1000;
    this.tokenExp = Date.now() + ttlMs;

    this.store.setItem(LS_TOKEN, this.token);
    this.store.setItem(LS_TOKEN_EXP, String(this.tokenExp));

    return this.token;
  }

  // =======================
  // Implementaciones
  // =======================

  /** MOCK: genera un token “tipo JWT” para pruebas, con retardo simulado */
  private async fetchTokenViaMock(c: KioskConfig): Promise<AuthResponse> {
    const payload = btoa(JSON.stringify({ cid: c.clientId, ts: Date.now() }));
    const token = `MOCK.${payload}.sig`;
    const latency = (environment as any).auth?.latencyMs ?? 300;

    return await lastValueFrom(
      of({ access_token: token, expires_in: (environment as any).auth?.tokenTtlSeconds ?? 24 * 3600 })
        .pipe(delay(latency))
    );
  }

  /** REAL: cuando el gateway esté listo, este camino queda activo al poner mock=false */
  private async fetchTokenViaHttp(c: KioskConfig): Promise<AuthResponse> {
    const url = `${environment.apiBaseUrl}/auth/token`; // TODO: confirmar ruta real
    const body = new URLSearchParams();
    body.set('grant_type', 'password');       // TODO: confirma grant_type si cambia
    body.set('client_id', c.clientId);
    body.set('client_secret', c.clientSecret);

    return await lastValueFrom(
      this.http.post<AuthResponse>(url, body, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }).pipe(
        // En caso que el backend use otro esquema, mapea aquí
        map(res => res)
      )
    );
  }
}
