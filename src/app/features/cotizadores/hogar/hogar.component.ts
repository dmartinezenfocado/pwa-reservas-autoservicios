import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { QuoteService } from '../../../core/services/quote.service';
import { BackCancelBarComponent } from '../../../shared/components/back-cancel-bar/back-cancel-bar.component';

@Component({
  selector: 'app-hogar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackCancelBarComponent],
  templateUrl: './hogar.component.html',
  styleUrls: ['./hogar.component.scss']
})
export class HogarComponent {
  private fb = inject(FormBuilder);
  private quotes = inject(QuoteService);

  form = this.fb.group({
    valor: [0, [Validators.required, Validators.min(1)]],
    ubicacion: ['', Validators.required],
  });

  prima: number | null = null;
  detalle = '';

  cotizar() {
    this.prima = null; this.detalle = '';
    this.quotes.cotizar('hogar', this.form.value).subscribe(r => {
      this.prima = r.prima; this.detalle = r.detalle;
    });
  }
}
