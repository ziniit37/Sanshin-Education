# Sanshin Education

Sanshin Education is a Next.js (App Router), React, TypeScript, and Tailwind site for South Korea study counseling. Public form notifications are sent through Resend from the `/api/contact` route handler.

## Develop

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add the Resend values below plus the canonical public URL. Keep it private; `.env*` files are ignored by Git.

## Run on Replit

1. Import this project into Replit and install dependencies with `npm install`.
2. In Replit **Secrets**, add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_TO_EMAIL`.
   - `RESEND_API_KEY` is the private API key from Resend.
   - `RESEND_FROM_EMAIL` must be a sender address on a domain verified with Resend, such as `Sanshin Education <forms@your-verified-domain.com>`.
   - `RESEND_TO_EMAIL` is the address that should receive form submissions.
   - Set `NEXT_PUBLIC_SITE_URL` to the canonical deployed origin (for example, `https://www.example.com`) so metadata, sitemap, and robots use the correct host. Sitemap and robots fall back to the incoming request origin if this is omitted.
3. For a deployment, use `npm run build` as the build command and `npm start` as the run command (it binds `0.0.0.0` on `$PORT`).

The same project also deploys to Vercel as-is; add the variables in the project settings.

Contact, counseling inquiry, eligibility, appointment, and newsletter requests are sent to `RESEND_TO_EMAIL`. The submitter's email is set as the reply-to address. The Resend key is used only by the server and is never bundled into the browser app. These forms do not create a CRM record or reserve an appointment; the team must follow up using the delivered email.

The contact endpoint applies a per-process IP rate limit and a honeypot. This in-memory limit is best-effort and resets when an instance restarts; configure an edge-level rate limit (such as a Vercel Firewall rule) before production to enforce limits consistently across serverless instances.

The privacy and terms pages are editable drafts and require review by the business owner and qualified counsel before publication. Add only verified contact and social details in the admin content settings.
