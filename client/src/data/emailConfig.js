const env = import.meta.env;

export const emailConfig = {
  enabled: env.VITE_EMAIL_ENABLED === 'true',
  recipient: env.VITE_RECIPIENT_EMAIL || 'symmetriccode01@gmail.com',
  turnstileSiteKey: env.VITE_TURNSTILE_SITE_KEY || '',
};
