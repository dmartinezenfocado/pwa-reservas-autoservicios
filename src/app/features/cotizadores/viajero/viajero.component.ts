import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { QuoteService } from '../../../core/services/quote.service';
import { BackCancelBarComponent } from '../../../shared/components/back-cancel-bar/back-cancel-bar.component';

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

  form = this.fb.group({
    destino: ['', Validators.required],
    desde: ['', Validators.required],
    hasta: ['', Validators.required],
    viajeros: [1, [Validators.required, Validators.min(1)]],
  });

  prima: number | null = null;
  detalle = '';

  cotizar() {
    this.prima = null; this.detalle = '';
    this.quotes.cotizar('viajero', this.form.value).subscribe(r => {
      this.prima = r.prima; this.detalle = r.detalle;
    });
  }
}
