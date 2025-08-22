import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackCancelBarComponent } from '../../../shared/components/back-cancel-bar/back-cancel-bar.component';
import { QuoteService } from '../../../core/services/quote.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-respaldo-migratorio',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackCancelBarComponent],
  templateUrl: './respaldo-migratorio.component.html',
  styleUrls: ['./respaldo-migratorio.component.scss']
})
export class RespaldoMigratorioComponent {
  private fb = inject(FormBuilder);
  private quotes = inject(QuoteService);
  private router = inject(Router);

  // Catálogos mock
  residencias = ['Temporal', 'Permanente', 'Estudiante', 'Trabajo'];
  nacionalidades = ['Dominicana', 'Venezolana', 'Haitiana', 'Estadounidense', 'Otro'];
  tiposId = ['Cédula', 'Pasaporte', 'Carné de Residencia'];

  dias = Array.from({length:31}, (_,i)=>i+1);
  meses = Array.from({length:12}, (_,i)=>i+1);
  anios = Array.from({length: 85}, (_,i)=> new Date().getFullYear() - i); // hasta 85 años

  // Formulario
  form = this.fb.group({
    residencia: ['Temporal', Validators.required],
    nacionalidad: ['Dominicana', Validators.required],

    tipoId: ['Cédula', Validators.required],
    identificacion: ['', Validators.required],

    dia: [null as number | null, Validators.required],
    mes: [null as number | null, Validators.required],
    anio: [null as number | null, Validators.required],
    edad: [{value: 0, disabled: true}],

    nombre: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.email]],
  });

  // Estado
  totalUsd = 0;
  cotizado = false;
  mensaje = '';

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.calcularEdad();
      this.totalUsd = this.precioMock(); // preview dinámico
      this.cotizado = false;
    });
  }

  private calcularEdad() {
    const { dia, mes, anio } = this.form.getRawValue();
    if (!dia || !mes || !anio) { this.form.controls.edad.setValue(0, {emitEvent:false}); return; }
    const hoy = new Date();
    let edad = hoy.getFullYear() - anio;
    const cumpleEsteAño = new Date(anio, mes - 1, dia);
    const yaCumplio = (hoy.getMonth() > cumpleEsteAño.getMonth()) ||
                      (hoy.getMonth() === cumpleEsteAño.getMonth() && hoy.getDate() >= cumpleEsteAño.getDate());
    if (!yaCumplio) edad--;
    if (edad < 0 || edad > 120) edad = 0;
    this.form.controls.edad.setValue(edad, {emitEvent:false});
  }

  /** Tarificador MOCK: ajusta por edad y tipo de residencia */
  private precioMock(): number {
    const edad = this.form.getRawValue().edad || 0;
    const residencia = this.form.value.residencia || 'Temporal';
    if (!edad) return 0;

    // base por edad
    let base = 40; // USD
    if (edad <= 25) base = 35;
    else if (edad <= 45) base = 40;
    else if (edad <= 60) base = 48;
    else if (edad <= 75) base = 65;
    else base = 85;

    // ajuste por residencia
    const ajuste = {
      Temporal: 0,
      Estudiante: -5,
      Trabajo: 5,
      Permanente: 8
    } as const;

    return Math.max(0, base + (ajuste[residencia as keyof typeof ajuste] ?? 0));
  }

  limpiar() {
    this.form.reset({
      residencia: 'Temporal',
      nacionalidad: 'Dominicana',
      tipoId: 'Cédula',
      identificacion: '',
      dia: null, mes: null, anio: null, edad: {value:0, disabled:true},
      nombre: '', email: ''
    });
    this.totalUsd = 0;
    this.mensaje = '';
    this.cotizado = false;
  }

  cotizar() {
    this.mensaje = '';
    this.cotizado = false;

    if (this.form.invalid) {
      this.mensaje = 'Completa los campos requeridos.';
      return;
    }
    const payload = {
      residencia: this.form.value.residencia,
      nacionalidad: this.form.value.nacionalidad,
      identificacion: {
        tipo: this.form.value.tipoId,
        numero: this.form.value.identificacion
      },
      nacimiento: {
        dia: this.form.value.dia,
        mes: this.form.value.mes,
        anio: this.form.value.anio,
        edad: this.form.getRawValue().edad
      },
      titular: {
        nombre: this.form.value.nombre,
        email: this.form.value.email
      },
      moneda: 'USD'
    };

    // Mock real (servicio reemplazable por API)
    this.quotes.cotizar('migratorio', payload).subscribe(r => {
      // si el mock regresa otra cifra, úsala; si no, usa nuestro preview
      this.totalUsd = r?.prima ?? this.totalUsd;
      this.mensaje = r?.detalle ?? 'Cotización simulada';
      this.cotizado = true;
    });
  }

  comprar() {
    if (!this.cotizado) { this.mensaje = 'Primero realiza la cotización.'; return; }
    // Navega a pago con el monto (puedes cambiar a state o store)
    this.router.navigate(['/pago'], { queryParams: { monto: this.totalUsd, ref: 'RES-MIG' }});
  }
}
