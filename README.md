# Symmetric Code

React + Vite company website with a Node.js/Express contact API.

## Structure

- `client/` React website, editable content, static FAQ assistant, and JSON-powered blog.
- `server/` Node.js API for validated consultation requests and email notifications.

## Local development

1. Install Node.js 20 or newer.
2. In `client/`, run `npm install` then `npm run dev`.
3. For local form testing, in `server/` copy `.env.example` to `.env`, fill in SMTP settings, then run `npm install` and `npm run dev`.
4. In `client/.env`, `VITE_API_URL` points to the local API; `VITE_SITE_URL` sets the canonical domain. In production, leave `VITE_API_URL` unset so the Cloudflare Pages Function handles the same-origin `/api/contact` request.

The local Express contact API requires SMTP credentials in `server/.env`; never put them in the React client or commit `.env` files. Production form emails are sent by the Cloudflare Pages Function. Blog posts live in `client/src/data/blogPosts.js` and are published by adding an entry. The sitemap and robots file are generated during the frontend build from current services, industries, blogs and policy routes, using `VITE_SITE_URL`. The seven portfolio entries from “Client Requirement Website” through “Gym Website” are in `client/src/data/projects.json`; their preview images are in `client/public/images/projects/`.

## Production deployment on Cloudflare

- Create a Cloudflare Pages project from this repository with the project root set to `client`, build command `npm run build`, and output directory `dist`. The `client/functions/` folder supplies the form API at `/api/contact` and `/api/health`; the frontend calls the API on the same origin.
- Set Pages build variables `VITE_SITE_URL=https://symmetriccode.tech`, `VITE_EMAIL_ENABLED=true`, and `VITE_TURNSTILE_SITE_KEY` to the public key for the production Turnstile widget. The frontend uses same-origin `/api/contact` in production.
- In Pages > Settings > Variables and Secrets, add `RESEND_API_KEY` and `TURNSTILE_SECRET_KEY` as encrypted secrets. Set `CONTACT_FROM_EMAIL` to a sender verified with Resend and `CONTACT_TO_EMAIL=symmetriccode01@gmail.com`. Keep these values server-side; never use a `VITE_` prefix for secrets.
- Create the Turnstile widget for `symmetriccode.tech` (and `www.symmetriccode.tech` if used), then configure its secret and public site key in the matching Pages environments. Local secret names are listed in `client/.dev.vars.example`.
- Verify `/api/health`, then submit the live form and confirm the normal email body arrives in the Gmail inbox. The message includes the submitter's name, email, company, selected service, and project details; no PDF is attached.

The `server/` Express API remains for local development. Production form delivery uses the Cloudflare Pages Function and Resend. Turnstile verification, fixed server-side recipients, request validation, a honeypot, and Resend idempotency keys protect the public form.

The portfolio content is based on the supplied `projects.json`. Confirm public-use permission for client work and set the Resend and Turnstile secrets before launch. Legal pages remain drafts until the effective date and client-specific agreement details are filled and reviewed. No client results or testimonials are invented.
