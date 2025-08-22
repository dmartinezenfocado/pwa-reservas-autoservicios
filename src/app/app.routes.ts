import { Routes } from '@angular/router';
import { configGuard } from './core/guards/config.guard';
import { tokenGuard } from './core/guards/token.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },
  { path: 'config', loadComponent: () => import('./features/configuracion/configuracion.component').then(m => m.ConfiguracionComponent) },
  { path: 'screensaver', loadComponent: () => import('./features/screensaver/screensaver.component').then(m => m.ScreensaverComponent) },

  {
    path: 'cotizar',
    canActivate: [configGuard, tokenGuard],
    children: [
      { path: 'vehiculo', loadComponent: () => import('./features/cotizadores/vehiculo/vehiculo.component').then(m => m.VehiculoComponent) },
      { path: 'viajero', loadComponent: () => import('./features/cotizadores/viajero/viajero.component').then(m => m.ViajeroComponent) },
      { path: 'hogar', loadComponent: () => import('./features/cotizadores/hogar/hogar.component').then(m => m.HogarComponent) },
      { path: 'respaldo-migratorio', loadComponent: () => import('./features/cotizadores/respaldo-migratorio/respaldo-migratorio.component').then(m => m.RespaldoMigratorioComponent) },
      { path: '', pathMatch: 'full', redirectTo: '/' }
    ]
  },

  { path: 'pago', canActivate: [configGuard, tokenGuard], loadComponent: () => import('./features/pago/pago.component').then(m => m.PagoComponent) },
  { path: 'documentos', canActivate: [configGuard, tokenGuard], loadComponent: () => import('./features/documentos/documentos.component').then(m => m.DocumentosComponent) },

  { path: '**', redirectTo: '' }
];
