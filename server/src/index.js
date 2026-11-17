import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const app = express();
const port = Number(process.env.PORT || 4000);
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map(s => s.trim()) }));
app.use(express.json({ limit: '20kb' }));

const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many requests. Please try again later.' } });
const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(120).optional().default(''),
  service: z.string().trim().max(100).optional().default(''),
  details: z.string().trim().min(10).max(4000),
  website: z.string().max(200).optional().default(''),
});

function mailer() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) throw new Error('Email delivery is not configured');
  return nodemailer.createTransport({ host: SMTP_HOST, port: Number(SMTP_PORT || 587), secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true', auth: { user: SMTP_USER, pass: SMTP_PASS } });
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.post('/api/contact', contactLimiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Please check your details and try again.', fields: parsed.error.flatten().fieldErrors });
  const { name, email, company, service, details, website } = parsed.data;
  if (website) return res.status(200).json({ message: 'Your request has been sent.' });
  if (!process.env.ADMIN_EMAIL || !process.env.MAIL_FROM) return res.status(503).json({ error: 'Email delivery is not configured.' });
  try {
    await mailer().sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      replyTo: { name, address: email },
      subject: `New consultation request — ${name}`,
      text: `New website consultation request\n\nName: ${name}\nEmail: ${email}\nCompany: ${company || 'Not provided'}\nService: ${service || 'Not selected'}\n\nProject details:\n${details}`,
      html: `<h2>New consultation request</h2><p><b>Name:</b> ${escapeHtml(name)}</p><p><b>Email:</b> ${escapeHtml(email)}</p><p><b>Company:</b> ${escapeHtml(company || 'Not provided')}</p><p><b>Service:</b> ${escapeHtml(service || 'Not selected')}</p><h3>Project details</h3><p>${escapeHtml(details).replace(/\n/g, '<br>')}</p>`,
    });
    return res.status(200).json({ message: 'Your request has been sent.' });
  } catch (error) {
    console.error('Contact email delivery failed:', error.message);
    return res.status(502).json({ error: 'We could not deliver your request. Please try again or email us directly.' });
  }
});

function escapeHtml(value) { return value.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]); }

app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'Unexpected server error.' }); });
app.listen(port, () => console.log(`Symmetric Code API listening on port ${port}`));
