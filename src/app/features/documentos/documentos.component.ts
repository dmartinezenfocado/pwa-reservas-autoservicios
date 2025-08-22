import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { PrinterService } from '../../core/services/printer.service';
import { BackCancelBarComponent } from '../../shared/components/back-cancel-bar/back-cancel-bar.component';

@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BackCancelBarComponent],
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent {
  private fb = inject(FormBuilder);
  private printer = inject(PrinterService);

  form = this.fb.group({ query: [''] });
  html: string | null = null;

  buscar() {
    // TODO: reemplazar por API real
    this.html = `<h3>Constancia de Póliza</h3><p>Número: ${this.form.value.query}</p>`;
  }

  imprimir() {
    if (this.html) this.printer.printHtml(this.html);
  }
}
