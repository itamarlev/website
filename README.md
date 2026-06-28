# itamarlev.com

Static personal website for private pages and section catalogues.

## Structure

```text
/
  index.html
  README.md
  /trips/
    /bulgaria-2026/
      index.html
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

Later, add more users to specific sections using Cloudflare Access policies instead of changing the site code.
