import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div style="padding:2rem">
      <h1>Portal Autogestión Seguros Reservas</h1>
      <p><a routerLink="/config">⚙ Configuración</a></p>
      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        <a routerLink="/cotizar/vehiculo">Cotizar Vehículo</a>
        <a routerLink="/cotizar/viajero">Cotizar Viajero</a>
        <a routerLink="/cotizar/hogar">Preserva tu Hogar</a>
        <a routerLink="/cotizar/respaldo-migratorio">Respaldo Migratorio</a>
        <a routerLink="/pago">Pago</a>
        <a routerLink="/documentos">Documentos</a>
      </div>
    </div>
  `,
})
export class HomeComponent {}
