# itamarlev.com

Private personal website for pages, trip journals, and section catalogues. Most pages are static; the shared trip journal uses Cloudflare Pages Functions.

## Structure

```text
/
  index.html
  README.md
  /trips/
    /bulgaria-2026/
      index.html
  /health/
    /fmd-5-day-guide/
      index.html        # Vegan 5-day FMD guide (Hebrew)
  /interviews/
    index.html
    /pagaya-ai-lead/
      index.html
      /presentation/
        index.html        # Management presentation (English)
        /he/
          index.html      # Management presentation (Hebrew)
  /assets/
    styles.css
```

## Local preview

Because the site is static, no build step is required. From the repository root:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.

## Cloudflare Pages deployment

Use Cloudflare Pages with:

- Build command: empty
- Build output directory: `/`
- Production domain: `itamarlev.com`

### Shared trip memories

The Zurich / Black Forest / Alsace page has a shared journal for every trip day. Notes and photo metadata are stored in D1; image files are stored in R2.

Create the resources once:

```sh
npx wrangler d1 create trip-memories
npx wrangler r2 bucket create trip-memories
```

Use these exact binding names under **Workers & Pages → the Pages project → Settings → Bindings**, then redeploy:

- D1 database: `TRIP_MEMORIES_DB`
- R2 bucket: `TRIP_MEMORIES_BUCKET`

Apply `migrations/0001_trip_memories.sql` in the D1 dashboard console. If your local Wrangler configuration already contains the D1 binding, the equivalent command is:

```sh
npx wrangler d1 execute TRIP_MEMORIES_DB --remote --file ./migrations/0001_trip_memories.sql
```

The root `_routes.json` limits Function invocations to `/api/trip-memories/*`. Keep that API path inside the same Cloudflare Access application as the trip page so only invited family members can read or change memories.

## Authentication

Do not implement authentication in the static HTML, CSS, or JavaScript. This repository must not include hardcoded passwords, fake login pages, client-side password checks, shared secrets, or private access tokens.

Static HTML cannot securely protect private content by itself. Any user who can fetch a static file can read it, and client-side checks can be bypassed. Authentication should be enforced before Cloudflare serves the files.

Use Cloudflare Zero Trust Access to protect the site.

### Initial Access application

Protect the whole site first:

- Domain: `itamarlev.com`
- Path: `/*`
- Allowed user: `itamar.lev@gmail.com`

Recommended authentication methods:

- SSO through Google or GitHub
- Email one-time PIN as fallback

### Future section-specific access

Prepare separate Cloudflare Access applications or policies for private sections as needed:

- `/trips/*`
- `/interviews/*`
- `/health/*`

Later, add more users to specific sections using Cloudflare Access policies instead of changing the site code.
