import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ConfigService } from '../../core/services/config.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private router = inject(Router);
  cfg = inject(ConfigService).configSig();
  goConfig(){ this.router.navigateByUrl('/config'); }
}
