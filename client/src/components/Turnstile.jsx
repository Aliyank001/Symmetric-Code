import { useEffect, useRef } from 'react';

let scriptReady;

function loadTurnstile() {
  if (scriptReady) return scriptReady;
  scriptReady = new Promise((resolve, reject) => {
    if (window.turnstile) return resolve();
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => {
      scriptReady = undefined;
      script.remove();
      reject(new Error('Verification could not load. Please check your connection.'));
    };
    document.head.appendChild(script);
  });
  return scriptReady;
}

export default function Turnstile({ siteKey, onToken, onError }) {
  const host = useRef(null);
  const callbacks = useRef({ onToken, onError });
  callbacks.current = { onToken, onError };

  useEffect(() => {
    let disposed = false;
    let widgetId;
    loadTurnstile().then(() => {
      if (disposed || !host.current) return;
      widgetId = window.turnstile.render(host.current, {
        sitekey: siteKey,
        action: 'contact',
        callback: token => callbacks.current.onToken(token),
        'expired-callback': () => callbacks.current.onToken(''),
        'error-callback': () => {
          callbacks.current.onToken('');
          callbacks.current.onError('Verification failed. Please try again.');
        },
      });
    }).catch(error => {
      if (!disposed) callbacks.current.onError(error.message);
    });
    return () => {
      disposed = true;
      if (widgetId) window.turnstile?.remove(widgetId);
    };
  }, [siteKey]);

  return <div ref={host} />;
}
