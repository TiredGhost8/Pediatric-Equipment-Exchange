# Auth Setup Guide

## 1. Install dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## 2. Add environment variables

Create or update `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Find these in your Supabase dashboard → Project Settings → API.

## 3. Set up the database

Run `supabase-setup.sql` in your **Supabase SQL Editor**. This creates:
- A `profiles` table with a `role` column (`physical_therapist` | `volunteer`)
- Row Level Security policies
- A trigger that auto-creates a profile when a user signs up

## 4. Copy files into your repo

| File | Destination in your repo |
|------|--------------------------|
| `lib/supabase.js` | `lib/supabase.js` |
| `lib/supabase-server.js` | `lib/supabase-server.js` |
| `app/login/page.jsx` | `app/login/page.jsx` |
| `app/auth/callback/route.js` | `app/auth/callback/route.js` |
| `middleware.js` | `middleware.js` (project root) |

## 5. Create users (admin flow)

Since this is for existing users only, create them via the Supabase dashboard:

1. Go to **Authentication → Users → Add User**
2. Enter their email + a temporary password
3. Run this SQL to set their role:

```sql
insert into public.profiles (id, full_name, role)
values ('their-user-uuid', 'Jane Doe', 'physical_therapist');
-- or 'volunteer'
```

## 6. Role-based redirects

After login, users are redirected based on their role:
- `physical_therapist` → `/dashboard/pt`
- `volunteer` → `/dashboard/volunteer`

Update these paths in `app/login/page.jsx` to match your actual dashboard routes.

## 7. Protect your routes

The `middleware.js` automatically redirects unauthenticated users to `/login`.
Public routes (no auth needed) are defined in the `publicRoutes` array — add more as needed.
