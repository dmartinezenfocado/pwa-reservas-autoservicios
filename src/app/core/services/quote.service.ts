import { Injectable } from '@angular/core';
import { of } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class QuoteService {
  cotizar(tipo: string, datos: any) {
    const base = Math.floor(Math.random()*900)+100;
    return of({ prima: base, detalle: `Cotización simulada para ${tipo}` });
  }
}
