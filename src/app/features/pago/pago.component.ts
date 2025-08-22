import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PosService } from '../../core/services/pos.service';
import { BackCancelBarComponent } from '../../shared/components/back-cancel-bar/back-cancel-bar.component';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackCancelBarComponent],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss']
})
export class PagoComponent {
  private fb = inject(FormBuilder);
  private pos = inject(PosService);

  form = this.fb.group({
    poliza: ['', Validators.required],
    monto: [0, [Validators.required, Validators.min(1)]],
  });

  loading = false;
  mensaje = '';

  pagar() {
    if (this.form.invalid) return;
    this.loading = true;
    this.mensaje = '';
    const v = this.form.value;
    this.pos.iniciarVenta(v.monto!, v.poliza!).subscribe({
      next: r => this.mensaje = r.aprobado ? `Aprobado. Autorización: ${r.autorizacion}` : `Rechazado: ${r.mensaje}`,
      error: () => this.mensaje = 'Error comunicando con POS',
      complete: () => this.loading = false
    });
  }
}
