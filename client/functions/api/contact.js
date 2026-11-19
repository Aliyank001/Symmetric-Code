const MAX_BODY_BYTES = 12_000;
const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

const escapeHtml = value => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

export async function onRequestPost({ request, env }) {
  if (request.headers.get('Origin') !== new URL(request.url).origin) {
    return json({ error: 'Request not allowed.' }, 403);
  }
  if (!request.headers.get('Content-Type')?.includes('application/json')) {
    return json({ error: 'Invalid request format.' }, 415);
  }

  const contentLength = Number(request.headers.get('Content-Length') || 0);
  if (contentLength > MAX_BODY_BYTES) return json({ error: 'The request is too large.' }, 413);

  let form;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return json({ error: 'The request is too large.' }, 413);
    form = JSON.parse(raw);
  } catch {
    return json({ error: 'Please submit a valid form.' }, 400);
  }

  if (!form || typeof form !== 'object' || Array.isArray(form)) return json({ error: 'Please submit a valid form.' }, 400);
  if (typeof form.website === 'string' && form.website.trim()) return json({ message: 'Your request has been sent.' });

  const name = typeof form.name === 'string' ? form.name.trim() : '';
  const email = typeof form.email === 'string' ? form.email.trim() : '';
  const company = typeof form.company === 'string' ? form.company.trim() : '';
  const service = typeof form.service === 'string' ? form.service.trim() : '';
  const details = typeof form.details === 'string' ? form.details.trim() : '';
  const token = typeof form.token === 'string' ? form.token : '';
  const submissionId = typeof form.submissionId === 'string' ? form.submissionId : '';

  if (name.length < 2 || name.length > 100) return json({ error: 'Please enter a name between 2 and 100 characters.' }, 400);
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Please enter a valid email address.' }, 400);
  if (company.length > 120 || service.length > 100) return json({ error: 'One of the form fields is too long.' }, 400);
  if (details.length < 10 || details.length > 4000) return json({ error: 'Please describe your project in 10 to 4000 characters.' }, 400);
  if (!token || token.length > 2048 || !/^[a-f0-9-]{36}$/i.test(submissionId)) return json({ error: 'Please complete the verification and try again.' }, 403);

  const requiredEnv = ['RESEND_API_KEY', 'CONTACT_FROM_EMAIL', 'CONTACT_TO_EMAIL', 'TURNSTILE_SECRET_KEY'];
  if (requiredEnv.some(key => !env[key])) return json({ error: 'Email delivery is not configured yet.' }, 503);

  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token }),
      signal: AbortSignal.timeout(10_000),
    });
    const challenge = await verification.json();
    if (!challenge.success || challenge.action !== 'contact' || challenge.hostname !== new URL(request.url).hostname) {
      return json({ error: 'Please complete the verification again.' }, 403);
    }

    const safeSubjectName = name.replace(/[\r\n]+/g, ' ').slice(0, 100);
    const text = [
      'New website consultation request', '',
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || 'Not provided'}`,
      `Service: ${service || 'Not selected'}`, '',
      'Project details:', details,
    ].join('\n');
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': `contact-${submissionId}`,
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `New consultation request — ${safeSubjectName}`,
        text,
        html: `<h2>New website consultation request</h2><p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Company:</b> ${escapeHtml(company || 'Not provided')}</p><p><b>Service:</b> ${escapeHtml(service || 'Not selected')}</p><h3>Project details</h3><p>${escapeHtml(details).replace(/\n/g, '<br>')}</p>`,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      console.error('Consultation email delivery failed:', response.status);
      return json({ error: 'We could not deliver your request. Please try again or email us directly.' }, 502);
    }
    return json({ message: 'Your request has been sent.' });
  } catch (error) {
    console.error('Consultation email delivery failed:', error.message);
    return json({ error: 'We could not deliver your request. Please try again or email us directly.' }, 502);
  }
}
