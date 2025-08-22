import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class ScannerService {
  async scan(): Promise<Blob> { return new Blob(); }
}
