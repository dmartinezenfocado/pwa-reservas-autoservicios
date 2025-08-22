import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackCancelBarComponent } from '../../../shared/components/back-cancel-bar/back-cancel-bar.component';

type Moneda = 'DOP' | 'USD';

@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackCancelBarComponent],
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.scss']
})
export class VehiculoComponent {
  private fb = inject(FormBuilder);

  // ====== Catálogos (mock) ======
  readonly tiposVehiculo = ['AUTOMOVIL', 'JEEPETA', 'CAMIONETA', 'MOTOCICLETA'];
  readonly combustibles   = ['Gasolina', 'Diésel', 'Híbrido', 'Eléctrico'];
  readonly cilindradas    = ['Hasta 4 Cilindros', '5 – 6 Cilindros', '8+ Cilindros'];

  readonly marcas = ['HONDA', 'TOYOTA', 'HYUNDAI', 'KIA', 'NISSAN'];
  readonly modelosPorMarca: Record<string, string[]> = {
    HONDA:  ['ACCORD 1800', 'CIVIC', 'CR-V'],
    TOYOTA: ['COROLLA', 'CAMRY', 'RAV4'],
    HYUNDAI:['ELANTRA', 'TUCSON', 'SANTA FE'],
    KIA:    ['RIO', 'SPORTAGE', 'SORENTO'],
    NISSAN: ['SENTRA', 'ALTIMA', 'X-TRAIL'],
  };

  readonly anios: number[] = Array.from({ length: 35 }, (_, i) => new Date().getFullYear() - i);

  // Tipo de cambio mock (puedes moverlo a environment si gustas)
  readonly usdRate = 59; // 1 USD = 59 DOP (ejemplo)

  // ====== Formulario ======
  form = this.fb.group({
    chasis: [''],
    anio: [this.anios[0], Validators.required],
    cilindros: [this.cilindradas[0], Validators.required],

    marca: [this.marcas[0], Validators.required],
    modelo: [this.modelosPorMarca[this.marcas[0]][0], Validators.required],
    tipoVehiculo: [this.tiposVehiculo[0], Validators.required],
    combustible: [this.combustibles[0], Validators.required],

    moneda: ['DOP' as Moneda, Validators.required],
    valor: [null as number | null, [Validators.required, Validators.min(1)]],
    condicion: ['okm' as 'okm' | 'usado', Validators.required],
  });

  // ====== Estado derivado ======
  readonly monedaSig   = signal<Moneda>('DOP');
  readonly valorSig    = signal<number | null>(null);
  readonly tolerancia  = 0.10; // ±10%

  readonly minSig = computed(() => {
    const v = this.valorSig();
    return v == null ? null : Math.max(0, Math.round(v * (1 - this.tolerancia)));
  });
  readonly maxSig = computed(() => {
    const v = this.valorSig();
    return v == null ? null : Math.round(v * (1 + this.tolerancia));
  });

  constructor() {
    // Mantén modelos sincronizados con marca
    effect(() => {
      const marca = this.form.controls.marca.value!;
      const modelos = this.modelosPorMarca[marca] ?? [];
      const actual = this.form.controls.modelo.value;
      if (!actual || !modelos.includes(actual)) {
        this.form.controls.modelo.setValue(modelos[0] ?? null as any);
      }
    });

    // Sincroniza monedas/valores con signals (para la UI)
    this.form.controls.moneda.valueChanges.subscribe(m => this.monedaSig.set(m as Moneda));
    this.form.controls.valor.valueChanges.subscribe(v => this.valorSig.set(v ?? null));
  }

  // ====== Acciones UI ======
  limpiar() {
    const marca = this.marcas[0];
    this.form.reset({
      chasis: '',
      anio: this.anios[0],
      cilindros: this.cilindradas[0],
      marca,
      modelo: this.modelosPorMarca[marca][0],
      tipoVehiculo: this.tiposVehiculo[0],
      combustible: this.combustibles[0],
      moneda: 'DOP',
      valor: null,
      condicion: 'okm',
    });
  }

  seleccionarMoneda(m: Moneda) {
    const actual = this.form.controls.moneda.value as Moneda;
    if (actual === m) return;
    const v = this.form.controls.valor.value;
    // Convierte el valor actual al cambiar de moneda
    if (v != null) {
      const convertido = actual === 'DOP'
        ? +(v / this.usdRate).toFixed(2)   // DOP -> USD
        : +(v * this.usdRate).toFixed(2);  // USD -> DOP
      this.form.controls.valor.setValue(convertido);
    }
    this.form.controls.moneda.setValue(m);
  }

  setCondicion(c: 'okm' | 'usado') {
    this.form.controls.condicion.setValue(c);
  }

  // Helpers para clase activa
  isActiveMoneda(m: Moneda) { return this.form.controls.moneda.value === m; }
  isActiveCond(c: 'okm'|'usado') { return this.form.controls.condicion.value === c; }
}
