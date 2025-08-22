export const environment = {
  production: true,
  apiBaseUrl: 'https://gateway.example.com', // TODO: prod real
  contentBaseUrl: '/assets',
  idleSeconds: 60,
  supportedLanguages: ['es', 'en'],

  // 🔒 En prod, desactiva mock
  auth: {
    mock: false,
    tokenTtlSeconds: 24 * 3600,
    latencyMs: 0
  }
};
