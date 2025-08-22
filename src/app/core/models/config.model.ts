export interface KioskConfig {
  terminalId: string;
  branchName: string;
  defaultLang: 'es' | 'en';
  menu: {
    vehiculo: boolean; viajero: boolean; hogar: boolean; respaldoMigratorio: boolean;
    pago: boolean; documentos: boolean;
  };
  printer?: { model?: string; enabled?: boolean };
  clientId: string;
  clientSecret: string;
}
