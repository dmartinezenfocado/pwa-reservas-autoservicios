import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { QuoteService } from '../../../core/services/quote.service';
import { BackCancelBarComponent } from '../../../shared/components/back-cancel-bar/back-cancel-bar.component';

@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackCancelBarComponent],
  templateUrl: './vehiculo.component.html',
  styleUrls: ['./vehiculo.component.scss']
})
export class VehiculoComponent {
  private fb = inject(FormBuilder);
  private quotes = inject(QuoteService);

  form = this.fb.group({
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
    anio: [2022, [Validators.required, Validators.min(1900)]],
    valor: [0, [Validators.required, Validators.min(1)]],
  });

  prima: number | null = null;
  detalle = '';

  cotizar() {
    this.prima = null; this.detalle = '';
    this.quotes.cotizar('vehiculo', this.form.value).subscribe(r => {
      this.prima = r.prima; this.detalle = r.detalle;
    });
  }
}
