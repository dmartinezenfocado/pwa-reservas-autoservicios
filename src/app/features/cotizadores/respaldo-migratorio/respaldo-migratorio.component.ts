import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { QuoteService } from '../../../core/services/quote.service';
import { BackCancelBarComponent } from '../../../shared/components/back-cancel-bar/back-cancel-bar.component';

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

  form = this.fb.group({
    tramite: ['', Validators.required],
    adultos: [1, [Validators.required, Validators.min(1)]],
    ninos: [0, [Validators.required, Validators.min(0)]],
  });

  prima: number | null = null;
  detalle = '';

  cotizar() {
    this.prima = null; this.detalle = '';
    this.quotes.cotizar('migratorio', this.form.value).subscribe(r => {
      this.prima = r.prima; this.detalle = r.detalle;
    });
  }
}
