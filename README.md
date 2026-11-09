# Sanshin Global Education

Sanshin Global Education is a Next.js (App Router), React, TypeScript, and Tailwind site for South Korea study counseling. Public form notifications are sent through Resend from the `/api/contact` route handler.

## Develop

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and add the Resend values below plus the canonical public URL. Keep it private; `.env*` files are ignored by Git.

## Run on Replit

1. Import this project into Replit and install dependencies with `npm install`.
2. In Replit **Secrets**, add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_TO_EMAIL`, and `RESEND_APPOINTMENT_TO_EMAIL`.
   - `RESEND_API_KEY` is the private API key from Resend.
   - `RESEND_FROM_EMAIL` must use a sender address on a domain verified with Resend, such as `Sanshin Global Education <forms@mail.sanshineducation.com>`.
   - `RESEND_TO_EMAIL` is the address that should receive form submissions.
   - `RESEND_APPOINTMENT_TO_EMAIL` receives consultation and appointment requests.
   - Set `NEXT_PUBLIC_SITE_URL` to `https://www.sanshineducation.com` so sitemap and robots use the canonical host. The site metadata also uses this canonical domain.
3. For a deployment, use `npm run build` as the build command and `npm start` as the run command (it binds `0.0.0.0` on `$PORT`).

The same project also deploys to Vercel as-is; add the variables in the project settings.

Admissions guidance is available at `/admissions/intakes`, `/admissions/how-to-apply`, `/admissions/transfer`, `/admissions/graduate`, `/programs/korean-language`, and `/study-pathways`. The 2027 calendar records official source links and last-checked dates in `src/lib/admissions-data.ts`; application status is calculated from each published application window using Korea Standard Time. Confirm dates with the linked institution before applying because schedules can change.

The source-controlled university directory is in `src/lib/university-directory.ts`; scholarship and visa guidance is presented in `src/views/ExpandedGuidancePages.tsx`; the 20+ source-linked study articles are in `src/lib/study-resources.ts`. Keep records conservative: use official source links, record the review date, distinguish unknown information from verified facts, and do not infer admission, transfer-credit, scholarship, or visa eligibility. The budget estimator labels national tuition averages and requires user-entered living-cost assumptions; it is not a university quote or complete cost-of-attendance calculation.

Contact, counseling inquiry, eligibility, and newsletter requests are sent to `RESEND_TO_EMAIL`; consultation and appointment requests are sent to `RESEND_APPOINTMENT_TO_EMAIL`. The submitter's email is set as the reply-to address. Password reset links are sent to the address entered by the user using `RESEND_FROM_EMAIL`. The Resend key is used only by the server and is never bundled into the browser app.

Authentication is currently a browser-local demo backed by `localStorage`, not a production account system. Password reset links only work in the browser where the account was created, and account data is not shared across devices. Use a server-side authentication and database provider before relying on password reset for real accounts.

The contact endpoint applies a per-process IP rate limit and a honeypot. This in-memory limit is best-effort and resets when an instance restarts; configure an edge-level rate limit (such as a Vercel Firewall rule) before production to enforce limits consistently across serverless instances.

The privacy and terms pages are editable drafts and require review by the business owner and qualified counsel before publication. Add only verified contact and social details in the admin content settings.
# Sanshin-Education
