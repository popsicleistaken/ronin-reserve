# Ronin Reserve — Handoff Document

Last updated: 2026-05-30  
**Status: All 5 phases complete. Live on Vercel. GitHub pushed.**

---

## Live URLs

| ที่ | URL |
|-----|-----|
| **หน้าลูกค้า** | https://my-first-app-xi-wine.vercel.app |
| **จองโต๊ะ** | https://my-first-app-xi-wine.vercel.app/book |
| **Admin login** | https://my-first-app-xi-wine.vercel.app/admin/login |
| **GitHub repo** | https://github.com/popsicleistaken/ronin-reserve |

## Admin Credentials

- Email: `rpiz@gmail.com`
- Password: `password123`

---

## Project Location (local dev)

```
/Users/popsicle/my-first-app/my-first-app/my-first-app/
```

### Start dev server

```bash
cd /Users/popsicle/my-first-app/my-first-app/my-first-app
npm_config_cache=/tmp/npm-cache npm run dev
# opens at http://localhost:3000
```

> **IMPORTANT:** Always use `npm_config_cache=/tmp/npm-cache` prefix before ALL npm/npx commands.  
> `/Users/popsicle/.npm` is owned by root — without this prefix, every npm command fails with EACCES.

### Deploy to Vercel

```bash
/tmp/vercel-cli/node_modules/.bin/vercel --prod --yes
```

(Vercel CLI is installed at `/tmp/vercel-cli/`, already logged in as `popsicleistaken`)

### Push to GitHub

```bash
git add -A && git commit -m "your message" && git push
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 App Router + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui v4 (base-nova / @base-ui/react) |
| Database + Auth | Supabase (supabase-js + @supabase/ssr) |
| Email | Resend (`onboarding@resend.dev` — MVP sender) |
| Hosting | Vercel |
| Fonts | Playfair Display (headings) + Montserrat (body) via next/font |

---

## Supabase Project

- Project ref: `kqjxkvxpixahqyoueukx`
- Dashboard: https://supabase.com/dashboard/project/kqjxkvxpixahqyoueukx
- Run SQL: `supabase db query --linked --file path/to/file.sql`

### Database Schema

**`branches`** — 4 rows seeded
- `id`, `name`, `slug`, `address`, `phone`, `opening_time`, `closing_time`, `capacity_per_slot` (default 30), `is_active`

**`bookings`**
- `id`, `booking_reference` (RON-YYYYMMDD-XXXX), `branch_id`, `customer_name`, `customer_phone`, `customer_email`, `booking_date`, `booking_time`, `party_size` (1–12), `occasion`, `special_request`, `status` (confirmed/seated/completed/cancelled/no_show), `internal_note`, `created_at`, `updated_at`

**`admin_users`**
- `id`, `email`, `name`, `role` (owner/manager/staff), `branch_id`, `created_at`

### RLS Rules
- `branches`: public SELECT (needed for booking form)
- `bookings`: public INSERT only; service role bypasses for admin reads/writes
- `admin_users`: service role only

---

## File Map

```
app/
├── (public)/               ← customer-facing pages (has Header + Footer)
│   ├── layout.tsx          ← wraps with Header + Footer
│   ├── page.tsx            ← landing page (hero, branch cards, how-it-works)
│   ├── book/
│   │   ├── page.tsx        ← booking page wrapper + >12 guests notice
│   │   ├── BookingForm.tsx ← full client form (shadcn components)
│   │   └── actions.ts      ← createBooking() + getSlotAvailability()
│   └── confirmation/
│       └── page.tsx        ← success page with ref + details
├── admin/
│   ├── layout.tsx          ← delegates to AdminShell
│   ├── AdminShell.tsx      ← client component: sidebar + mobile hamburger
│   ├── page.tsx            ← dashboard server component (force-dynamic)
│   ├── BookingsDashboard.tsx ← dashboard client (table, filters, stats)
│   ├── actions.ts          ← logout(), updateBookingStatus(), updateBookingNote()
│   ├── bookings/[id]/
│   │   ├── page.tsx        ← booking detail server component (force-dynamic)
│   │   └── BookingDetailClient.tsx ← status selector + notes + save
│   └── login/
│       ├── page.tsx        ← login page wrapper
│       └── LoginForm.tsx   ← email/password → supabase.auth.signInWithPassword
├── layout.tsx              ← root layout (fonts, lang="th")
└── globals.css             ← Tailwind v4 + shadcn CSS vars + brand colors

lib/
├── supabase.ts             ← anon client (public) + service role client (server-only)
├── supabase/
│   ├── server.ts           ← SSR auth client (cookie-based, for middleware)
│   └── client.ts           ← browser auth client (for login form)
└── utils.ts                ← cn() helper

components/
├── layout/
│   ├── Header.tsx          ← sticky header with logo + "จองโต๊ะ" button
│   └── Footer.tsx          ← footer with branch links
└── ui/                     ← shadcn components
    ├── badge.tsx, button.tsx, card.tsx, input.tsx
    ├── label.tsx, select.tsx, separator.tsx
    ├── table.tsx, textarea.tsx

middleware.ts               ← protects /admin/* → redirects to /admin/login
```

---

## Key Business Logic

### Booking Validation (server-side, in `actions.ts`)
1. Must book **at least 2 hours in advance** (Bangkok UTC+7)
2. Max **30 days ahead**
3. Party size **1–12 people** (>12 → contact branch directly)
4. **Capacity check**: count confirmed+seated bookings per branch/date/slot ≥ `capacity_per_slot` (30)
5. Reference format: `RON-YYYYMMDD-XXXX` (sequential per day)

### Slot Availability (client-side, live)
- `getSlotAvailability(branchSlug, date)` called automatically when user picks branch + date
- Full slots are greyed out + strikethrough in the time grid

### Email
- Sent via Resend after successful booking (non-blocking — booking saves even if email fails)
- From: `onboarding@resend.dev` (MVP placeholder — upgrade to custom domain later)
- Only sent if customer provided email

### Admin Dashboard
- Default view: **all upcoming bookings** (today → future), ordered by date + time
- Date picker (top right) → filter to a specific day → "← ทั้งหมด" to return to upcoming
- `force-dynamic` on all admin pages → always fetches fresh data, no caching

### Auth
- Supabase Auth (email/password) with cookie-based sessions via @supabase/ssr
- Middleware at `middleware.ts` protects all `/admin/*` routes
- Unauthenticated → redirect to `/admin/login`

---

## Bugs Fixed (this session)

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Admin showed no bookings | Dashboard filtered to "today UTC" only; bookings were for future dates | Changed default to show all upcoming (today → future) using Bangkok timezone |
| New bookings didn't appear in admin | Next.js data cache on Vercel cached Supabase query results | Added `export const dynamic = "force-dynamic"` to admin pages |
| Stale dev server (port confusion) | Old server on :3000, new one on :3001 | Kill old process, restart cleanly |

---

## What's NOT Done (future improvements)

- [ ] Custom email sender domain (currently `onboarding@resend.dev`)
- [ ] Custom Vercel domain (currently `.vercel.app`)
- [ ] Booking cancellation flow for customers (email link to cancel)
- [ ] SMS / LINE notification to branch when new booking comes in
- [ ] Admin: view bookings by branch only (if staff ≠ owner)
- [ ] Automated reminders (1 day before booking)

---

## Environment Variables

Set in `.env.local` (local) AND Vercel dashboard (production). Never commit `.env.local`.

```
NEXT_PUBLIC_SUPABASE_URL=https://kqjxkvxpixahqyoueukx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   ← server-only, never expose client-side
RESEND_API_KEY=re_...              ← server-only, never expose client-side
```

---

## Safety Rules (from CLAUDE.md — never violate)

- Never put `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` in client-side code
- Never push to GitHub or deploy to Vercel without explicit owner confirmation
- Never delete or restructure Supabase tables without confirming first
- Always enable RLS on new Supabase tables
- Always keep `.env.local` in `.gitignore`

---

## Quick Test Checklist

- [ ] `https://my-first-app-xi-wine.vercel.app` — landing page loads
- [ ] `/book` → fill form → submit → see confirmation page with ref code
- [ ] Booking appears in admin immediately after (no delay)
- [ ] `/admin/login` → login → dashboard shows booking
- [ ] Click "View →" → detail page opens
- [ ] Change status → Save → badge updates
- [ ] Add internal note → Save → note persists
- [ ] Mobile: sidebar opens with hamburger button (≤ md breakpoint)
