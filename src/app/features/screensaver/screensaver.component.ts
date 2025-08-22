import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-screensaver',
  standalone: true,
  templateUrl: './screensaver.component.html',
  styleUrls: ['./screensaver.component.scss']
})
export class ScreensaverComponent {
  constructor(private router: Router) {}
  exit(){ this.router.navigateByUrl('/'); }
}
