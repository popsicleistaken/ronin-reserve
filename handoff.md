# Ronin Reserve — Handoff Document

Last updated: 2026-05-30  
Next session should start here.

---

## Project location

```
/Users/popsicle/my-first-app/my-first-app/my-first-app/
```

## How to start the dev server

```bash
cd /Users/popsicle/my-first-app/my-first-app/my-first-app
npm_config_cache=/tmp/npm-cache npm run dev
```

Then open: http://localhost:3000

> **Note:** Always use `npm_config_cache=/tmp/npm-cache` before any npm/npx command.  
> The `/Users/popsicle/.npm` cache directory is owned by root and will cause permission errors without this prefix.

---

## What has been built (Phases 1–4 complete)

### Phase 1 — Foundation ✅
- Next.js 14 App Router + TypeScript
- Tailwind CSS v4 + shadcn/ui v4 (base-nova style)
- Fonts: Playfair Display (heading) + Montserrat (body)
- Brand colors: Ronin Green `#396542`, Pizza Accent `#964915`, Cream `#fff8f5`
- Supabase tables: `branches`, `bookings`, `admin_users` (all with RLS)
- 4 branches seeded: Ladprao 18, Sukhumvit 34, Ari, Phayathai

### Phase 2 — Customer Pages ✅
- `/` — Landing page with hero + 4 branch cards + CTA
- `/book` — Booking form (branch selector, date, time slots, guest count 1–12)
- `/confirmation` — Shows booking reference + details after successful booking

### Phase 3 — Booking Logic & Email ✅
- Server Action validates: 2hr advance minimum, 30-day max, capacity check
- Booking reference format: `RON-YYYYMMDD-XXXX`
- Saves to Supabase, sends confirmation email via Resend
- Email from: `onboarding@resend.dev` (MVP placeholder)

### Phase 4 — Admin Panel ✅
- `/admin/login` — Login with email/password (Supabase Auth)
- Middleware protects all `/admin/*` routes
- `/admin` — Dashboard: 4 stat cards + reservations table + filters (date, branch, status) + search
- `/admin/bookings/[id]` — Detail page: full booking info + status pill selector + internal notes textarea + Save button

**Admin credentials:**  
Email: `rpiz@gmail.com`  
Password: `password123`

---

## Phase 5 — Polish & Deploy (NOT started)

This is the only remaining phase.

### What needs to happen in Phase 5:

1. **Design review** — Compare every page against `/design/` mockups. Fix spacing, colors, button styles that don't match.

2. **Mobile testing** — Test all 6 pages on a mobile viewport (375px width). Fix anything that looks broken.

3. **Edge case handling:**
   - Time slot is full → don't show that slot as selectable  
   - Party size > 12 → show "Please contact us directly" message  
   - Currently these are not enforced in the UI (only in the server action)

4. **End-to-end test** — Full flow: customer books → receives email → admin sees it → admin changes status

5. **Deploy to Vercel:**
   - Create Vercel account / connect project
   - Add all environment variables from `.env.local` to Vercel
   - Deploy
   - Confirm the user owns a domain to point at the app (or use Vercel's free `.vercel.app` subdomain)

6. **Update custom email sender** (optional before launch) — Change Resend `from:` from `onboarding@resend.dev` to a real domain email once the domain is verified in Resend.

---

## Key files

| File | What it does |
|------|-------------|
| `app/(public)/page.tsx` | Landing page |
| `app/(public)/book/page.tsx` | Booking form page (server) |
| `app/(public)/book/BookingForm.tsx` | Booking form (client) |
| `app/(public)/book/actions.ts` | Booking server action (validate + insert + email) |
| `app/(public)/confirmation/page.tsx` | Confirmation page |
| `app/admin/page.tsx` | Admin dashboard (server) |
| `app/admin/BookingsDashboard.tsx` | Dashboard UI (client) |
| `app/admin/bookings/[id]/page.tsx` | Booking detail (server) |
| `app/admin/bookings/[id]/BookingDetailClient.tsx` | Status + notes editor (client) |
| `app/admin/actions.ts` | Server actions: logout, updateBookingStatus, updateBookingNote |
| `app/admin/login/LoginForm.tsx` | Login form |
| `middleware.ts` | Protects /admin/* routes |
| `lib/supabase.ts` | Data client (service role, server-only) |
| `lib/supabase/server.ts` | Auth SSR client (cookie-based) |
| `lib/supabase/client.ts` | Auth browser client |
| `.env.local` | All secrets (never commit this) |
| `supabase/migrations/` | SQL: tables, RLS, seed data |

---

## Supabase project

Project ref: `kqjxkvxpixahqyoueukx`  
Dashboard: https://supabase.com/dashboard/project/kqjxkvxpixahqyoueukx

To run SQL against the database:
```bash
supabase db query --linked --file path/to/file.sql
```

Or paste SQL directly in the Supabase dashboard → SQL Editor.

---

## Important notes for next session

- **Do not run `npm run dev` without the cache prefix** — use `npm_config_cache=/tmp/npm-cache npm run dev`
- **Do not add any new npm packages without checking if shadcn already has a component for it** (per CLAUDE.md)
- **Do not deploy to Vercel without the owner's explicit confirmation** (per CLAUDE.md)
- **Do not change Supabase table structure** without confirming first (per CLAUDE.md)
- The `internal_note` column must exist in the `bookings` table for admin notes to save. If it doesn't exist yet, run:
  ```sql
  ALTER TABLE bookings ADD COLUMN IF NOT EXISTS internal_note TEXT;
  ```

---

## Quick test checklist for Phase 5

- [ ] `http://localhost:3000` — Landing page looks good on mobile + desktop
- [ ] `http://localhost:3000/book` — Can fill and submit a booking
- [ ] Email received after booking
- [ ] `http://localhost:3000/confirmation?ref=RON-...` — Shows correct booking details
- [ ] `http://localhost:3000/admin/login` — Login works with rpiz@gmail.com / password123
- [ ] `http://localhost:3000/admin` — Dashboard shows today's bookings
- [ ] Click "View" on a booking → detail page opens
- [ ] Can change status and save
- [ ] Can add internal note and save
