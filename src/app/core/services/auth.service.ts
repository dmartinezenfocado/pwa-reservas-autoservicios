import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ConfigService } from './config.service';
import { lastValueFrom } from 'rxjs';

interface AuthResponse { access_token: string; expires_in?: number; }
const LS_TOKEN = 'reservas.kiosk.token';
const LS_TOKEN_EXP = 'reservas.kiosk.tokenExp';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string | null = localStorage.getItem(LS_TOKEN);
  private tokenExp = Number(localStorage.getItem(LS_TOKEN_EXP) || 0);

  constructor(private http: HttpClient, private cfg: ConfigService) {}

  getToken() { return this.token; }
  private isExpired() { return !this.token || Date.now() > this.tokenExp; }

  async ensureToken() {
    if (!this.isExpired()) return this.token;
    const c = this.cfg.configSig();
    if (!c) throw new Error('Sin configuración');
    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', c.clientId);
    body.set('client_secret', c.clientSecret);
    // TODO: endpoint real del gateway
    const url = `${environment.apiBaseUrl}/auth/token`;
    const res = await lastValueFrom(
      this.http.post<AuthResponse>(url, body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
    );
    if (!res?.access_token) throw new Error('No se pudo obtener token');
    this.token = res.access_token;
    const ttl = (res.expires_in ?? 24 * 3600) * 1000;
    this.tokenExp = Date.now() + ttl;
    localStorage.setItem(LS_TOKEN, this.token);
    localStorage.setItem(LS_TOKEN_EXP, String(this.tokenExp));
    return this.token;
  }
}
