# Symmetric Code

React + Vite company website with a Node.js/Express contact API.

## Structure

- `client/` React website, editable content, static FAQ assistant, and JSON-powered blog.
- `server/` Node.js API for validated consultation requests and email notifications.

## Local development

1. Install Node.js 20 or newer.
2. In `client/`, run `npm install` then `npm run dev`.
3. In `server/`, copy `.env.example` to `.env`, fill in SMTP settings, then run `npm install` and `npm run dev`.
4. Configure `VITE_API_URL` and `VITE_SITE_URL` in `client/.env` for the API and your actual public domain.

The contact form requires SMTP credentials to deliver email. Keep secrets in `server/.env`; never place them in the React client. Blog posts live in `client/src/data/blogPosts.js` and are published by adding an entry. The sitemap and robots file are generated during the frontend build from current services, industries, blogs and policy routes, using `VITE_SITE_URL`. The seven portfolio entries from “Client Requirement Website” through “Gym Website” are in `client/src/data/projects.json`; their preview images are in `client/public/images/projects/`.

The portfolio content is based on the supplied `projects.json`. Confirm public-use permission for client work and replace the placeholder public domain and SMTP configuration before launch. Legal pages are drafts with placeholders and must be completed/reviewed before they are treated as operative policies. No client results or testimonials are invented.
