import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class PrinterService {
  printHtml(html: string) {
    const w = window.open('', '_blank', 'width=800,height=600');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  }
}
