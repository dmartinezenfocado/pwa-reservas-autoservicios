import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackCancelBarComponent } from '../../../shared/components/back-cancel-bar/back-cancel-bar.component';
import { QuoteService } from '../../../core/services/quote.service';

@Component({
  selector: 'app-viajero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackCancelBarComponent],
  templateUrl: './viajero.component.html',
  styleUrls: ['./viajero.component.scss']
})
export class ViajeroComponent {
  private fb = inject(FormBuilder);
  private quotes = inject(QuoteService);

  // Catálogos (mock)
  planes = ['Básico', 'Estándar', 'Premium'];
  tiposIdent = ['Cédula', 'Pasaporte'];

  // Form principal
  form = this.fb.group({
    // Cantidades por edad
    menores64: [0, [Validators.required, Validators.min(0)]],
    s65a75: [0, [Validators.required, Validators.min(0)]],
    s76a85: [0, [Validators.required, Validators.min(0)]],

    // Datos del viaje
    destino: ['', Validators.required],
    plan: ['Estándar', Validators.required],
    salida: ['', Validators.required],
    regreso: ['', Validators.required],

    // Información general
    tipoId: ['Cédula', Validators.required],
    identificacion: ['', [Validators.required]],
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.email]],
  });

  // Estado UI
  dias = 0;
  mensaje = '';
  prima: number | null = null;

  constructor() {
    // Recalcular días cuando cambian fechas
    this.form.controls.salida.valueChanges.subscribe(() => this.recalcDias());
    this.form.controls.regreso.valueChanges.subscribe(() => this.recalcDias());
  }

  get totalViajeros(): number {
    const f = this.form.value;
    return (f.menores64 || 0) + (f.s65a75 || 0) + (f.s76a85 || 0);
  }

  private recalcDias() {
    const s = this.form.controls.salida.value;
    const r = this.form.controls.regreso.value;
    if (!s || !r) { this.dias = 0; return; }
    const d1 = new Date(s);
    const d2 = new Date(r);
    const ms = d2.getTime() - d1.getTime();
    this.dias = ms > 0 ? Math.ceil(ms / (1000 * 60 * 60 * 24)) : 0;
  }

  inc(field: 'menores64' | 's65a75' | 's76a85') {
    const v = (this.form.controls[field].value || 0) + 1;
    this.form.controls[field].setValue(v);
  }

  dec(field: 'menores64' | 's65a75' | 's76a85') {
    const v = (this.form.controls[field].value || 0) - 1;
    this.form.controls[field].setValue(Math.max(0, v));
  }

  limpiar() {
    this.form.reset({
      menores64: 0, s65a75: 0, s76a85: 0,
      destino: '', plan: 'Estándar', salida: '', regreso: '',
      tipoId: 'Cédula', identificacion: '', nombre: '', email: ''
    });
    this.dias = 0;
    this.mensaje = '';
    this.prima = null;
  }

  cotizar() {
    this.mensaje = '';
    this.prima = null;

    // Validaciones mínimas
    if (this.form.invalid) {
      this.mensaje = 'Completa los campos requeridos.';
      return;
    }
    if (this.totalViajeros <= 0) {
      this.mensaje = 'Debes indicar al menos 1 viajero.';
      return;
    }
    if (this.dias <= 0) {
      this.mensaje = 'La fecha de regreso debe ser posterior a la de salida.';
      return;
    }
    // Restricción (nota de diseño)
    const destino = (this.form.controls.destino.value || '').toLowerCase();
    if (destino.includes('república dominicana') || destino.includes('republica dominicana')) {
      this.mensaje = 'La contratación de este seguro no está disponible para uso en República Dominicana.';
      return;
    }

    const payload = {
      viajeros: {
        menores64: this.form.value.menores64,
        s65a75: this.form.value.s65a75,
        s76a85: this.form.value.s76a85
      },
      viaje: {
        destino: this.form.value.destino,
        plan: this.form.value.plan,
        salida: this.form.value.salida,
        regreso: this.form.value.regreso,
        dias: this.dias
      },
      contratante: {
        tipoId: this.form.value.tipoId,
        identificacion: this.form.value.identificacion,
        nombre: this.form.value.nombre,
        email: this.form.value.email
      }
    };

    // Llama al QuoteService (mock listo para reemplazar por API real)
    this.quotes.cotizar('viajero', payload).subscribe(r => {
      this.prima = r.prima;
      this.mensaje = r.detalle;
    });
  }
}
