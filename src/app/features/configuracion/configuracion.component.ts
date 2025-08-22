import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigService } from '../../core/services/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.scss']
})
export class ConfiguracionComponent {
  private fb = inject(FormBuilder);
  private cfg = inject(ConfigService);
  private router = inject(Router);

  form = this.fb.group({
    terminalId: ['', Validators.required],
    branchName: ['', Validators.required],
    defaultLang: ['es', Validators.required],
    vehiculo: [true], viajero: [true], hogar: [true], respaldoMigratorio: [true],
    pago: [true], documentos: [true],
    clientId: ['', Validators.required], clientSecret: ['', Validators.required],
  });

  ngOnInit(){
    const c = this.cfg.configSig();
    if (c) {
      this.form.patchValue({
        terminalId: c.terminalId,
        branchName: c.branchName,
        defaultLang: c.defaultLang,
        vehiculo: c.menu.vehiculo,
        viajero: c.menu.viajero,
        hogar: c.menu.hogar,
        respaldoMigratorio: c.menu.respaldoMigratorio,
        pago: c.menu.pago,
        documentos: c.menu.documentos,
        clientId: c.clientId,
        clientSecret: c.clientSecret,
      });
    }
  }

  save(){
    const v = this.form.value;
    this.cfg.save({
      terminalId: v.terminalId!, branchName: v.branchName!,
      defaultLang: v.defaultLang as any,
      menu: {
        vehiculo: !!v.vehiculo, viajero: !!v.viajero, hogar: !!v.hogar,
        respaldoMigratorio: !!v.respaldoMigratorio, pago: !!v.pago, documentos: !!v.documentos
      },
      clientId: v.clientId!, clientSecret: v.clientSecret!,
    });
    this.router.navigateByUrl('/');
  }

  async onFile(e: Event){
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    await this.cfg.importFromFile(file);
    this.router.navigateByUrl('/');
  }
}
