export const environment = {
 production: false,
  apiBaseUrl: 'https://gateway.example.com', // TODO: reemplazar cuando tengas el real
  contentBaseUrl: '/assets',
  idleSeconds: 60,
  supportedLanguages: ['es', 'en'],

  // ⚙️ Auth mock activado en dev
  auth: {
    mock: true,
    tokenTtlSeconds: 24 * 3600, // 24h
    latencyMs: 400              // retardo simulado para UX realista
  }
};
