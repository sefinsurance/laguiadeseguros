# Cloudflare Setup

Recommended Pages configuration:

- Project name: `laguiadeseguros`
- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Functions directory: `functions`
- Custom domain: `laguiadeseguros.com`

Runtime variables:

- `LEADS_API_BASE_URL`: `https://laguia-leads.obamacarelocal.com`
- `LEADS_API_KEY`: secret API key for the MLC leads service
- `SITE_ORIGIN`: `https://laguiadeseguros.com`

The lead form posts to `/api/lead`. The Pages Function validates consent and required fields, maps the payload to the MLC lead schema, and calls `/api/leads/upsert` with `x-api-key`.
