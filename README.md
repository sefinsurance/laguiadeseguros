# La Guia de Seguros

Public lead funnel for `laguiadeseguros.com`.

## Stack

- Vite + React
- Cloudflare Pages static build
- Cloudflare Pages Function at `/api/lead`
- MLC lead API proxy using `LEADS_API_BASE_URL` and `LEADS_API_KEY`

## Local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
node --check functions/api/lead/index.js
```

## Cloudflare Environment

Set these in Cloudflare Pages production variables/secrets:

- `LEADS_API_BASE_URL` (`https://laguia-leads.obamacarelocal.com`, optional because the Function has this production default)
- `LEADS_API_KEY`
- `SITE_ORIGIN=https://laguiadeseguros.com`

The browser never receives `LEADS_API_KEY`; submissions go through `/api/lead`.
