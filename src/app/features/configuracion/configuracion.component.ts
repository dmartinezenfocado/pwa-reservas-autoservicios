import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConfigService } from '../../core/services/config.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div style="padding:2rem;max-width:800px;margin:0 auto">
      <h2>Configuración de Terminal</h2>
      <form [formGroup]="form" (ngSubmit)="save()" style="display:grid;gap:.75rem">
        <input placeholder="ID de terminal" formControlName="terminalId">
        <input placeholder="Sucursal" formControlName="branchName">
        <select formControlName="defaultLang">
          <option value="es">Español</option>
          <option value="en">English</option>
        </select>
        <fieldset style="display:grid;grid-template-columns:repeat(2,1fr);gap:.5rem">
          <label><input type="checkbox" formControlName="vehiculo"> Vehículo</label>
          <label><input type="checkbox" formControlName="viajero"> Viajero</label>
          <label><input type="checkbox" formControlName="hogar"> Hogar</label>
          <label><input type="checkbox" formControlName="respaldoMigratorio"> Respaldo Migratorio</label>
          <label><input type="checkbox" formControlName="pago"> Pago</label>
          <label><input type="checkbox" formControlName="documentos"> Documentos</label>
        </fieldset>
        <input placeholder="client_id" formControlName="clientId">
        <input placeholder="client_secret" formControlName="clientSecret">
        <button type="submit" [disabled]="form.invalid">Guardar</button>
      </form>
    </div>
  `,
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
}
