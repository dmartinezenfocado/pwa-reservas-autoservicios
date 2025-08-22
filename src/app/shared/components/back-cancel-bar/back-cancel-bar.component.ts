import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-cancel-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-cancel-bar.component.html',
  styleUrls: ['./back-cancel-bar.component.scss'],
})
export class BackCancelBarComponent {
  @Input() backText = 'Atrás';
  @Input() cancelText = 'Cancelar';
  constructor(private router: Router) {}
  goBack() {
    history.length > 1 ? history.back() : this.router.navigateByUrl('/');
  }
  cancel() {
    this.router.navigateByUrl('/');
  }
}
