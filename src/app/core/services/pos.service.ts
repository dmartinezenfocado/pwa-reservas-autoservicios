import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PosVentaResponse {
  aprobado: boolean;
  autorizacion?: string;
  mensaje?: string;
}

export interface PosAnulacionResponse {
  ok: boolean;
  mensaje?: string;
}

@Injectable({ providedIn: 'root' })
export class PosService {
  private http = inject(HttpClient);
  // Usa environment.posBaseUrl si existe; si no, intenta con localhost
  private base = (environment as any).posBaseUrl || 'http://127.0.0.1:7777/pos';

  /** Inicia una venta en el POS */
  iniciarVenta(monto: number, referencia: string) {
    // MOCK si no hay base definida o estás en dev sin POS
    if (!this.base) {
      return of<PosVentaResponse>({
        aprobado: true,
        autorizacion: 'MOCK-' + Math.floor(100000 + Math.random() * 900000)
      }).pipe(delay(600));
    }
    return this.http.post<PosVentaResponse>(`${this.base}/venta`, { monto, referencia });
  }

  /** Anula una venta previa */
  anular(referencia: string) {
    if (!this.base) {
      return of<PosAnulacionResponse>({ ok: true, mensaje: 'Anulación mock OK' }).pipe(delay(400));
    }
    return this.http.post<PosAnulacionResponse>(`${this.base}/anulacion`, { referencia });
  }
}
