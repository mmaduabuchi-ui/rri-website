Here is the same content rewritten as flowing prose, without bullets. You can paste it directly into a README or GitHub wiki page.

---

# How I Built This

Realise Reality Initiative (RRI) is a full-stack membership platform built with Next.js 16, Supabase, and Tailwind CSS, deployed on Vercel. It handles membership applications, admin approval, product access, manual payments, media streaming, and a real-time community chat — all without a payment gateway and without a separate backend server.

## The Stack

The application runs on Next.js 16 using the App Router, React 19, and Server Components. Everything is written in TypeScript and styled with Tailwind CSS v4. The database is PostgreSQL, hosted and managed by Supabase. Authentication, file storage, and real-time messaging are also provided by Supabase. The site is deployed on Vercel, which automatically builds and deploys every push to the `main` branch on GitHub.

There is no custom backend. Next.js Server Components and Route Handlers handle all server-side logic, and Supabase provides everything else — the database, auth, file storage, and real-time channels.

## Three Supabase Clients

The codebase uses three distinct Supabase clients, each with a specific purpose. The browser client, in `src/lib/supabase/client.ts`, is used for client-side authentication and Realtime subscriptions. The server client, in `src/lib/supabase/server.ts`, is used inside Server Components and Route Handlers, and it respects Row-Level Security because it carries the user's session cookie. The admin client, in `src/lib/supabase/admin.ts`, uses the service role key and bypasses RLS entirely. It is only ever used server-side, and only after the caller has been verified as an admin through the user-scoped client.

## The Data Model

Ten tables power the platform. The `profiles` table holds one row per user, created automatically by a database trigger whenever a new auth user is registered. It stores name, email, role, country, city, skills, and membership status. The `membership_applications` table holds incoming join requests, which are a separate flow from registration — approved applicants are linked back to a profile through an `approved_profile_id` column. The `products` table holds content items classified as free, paid, or donation, each with a media type of video, audio, text, or link. The `product_access` table records which member has access to which product. The `payment_requests` table holds manual payment submissions awaiting admin review. The `articles` table stores blog posts, news, and announcements, with optional media support for images, videos, audio, and external links. The `messages` table powers the real-time chat. The `settings` table is a simple key-value store for the admin email, WhatsApp number, and bank details.

Two database views add a security layer on top of the raw tables. The `products_safe` view returns `content`, `external_url`, and `storage_path` as `null` whenever the current user does not have access, which means guests and non-granted members can see that a product exists without being able to read its content. The `members_directory` view exposes only safe profile fields — name, country, city, skills, avatar, and role — while keeping emails and phone numbers private.

Both views use `security_invoker = true`. Without that flag, a Postgres view runs with the privileges of whoever created it, which means it can silently bypass Row-Level Security. Supabase's Advisor Center flags this as a critical security issue, and rightly so — the first time I shipped `products_safe` without that flag, the view was returning paid content to anonymous users. Adding `security_invoker = true` fixed it and made the view run with the caller's privileges.

## Row-Level Security

Every table has RLS enabled, and the policies follow a simple pattern. Public reads are allowed where it makes sense — anyone can read `articles` where `status = 'published'`, and `products_safe` handles content filtering internally. Owner writes are scoped to the user — people can only update their own profile or edit their own chat messages. Admin writes are gated behind `public.is_admin()`, a small helper function that checks whether the current `auth.uid()` has `role = 'admin'` in `profiles`. And finally, admin server routes use the service-role client, but only after re-verifying the caller's role through the user-scoped client. That way, even if someone crafts a request directly against the API, they still cannot perform admin actions without a legitimate admin session.

## How Authentication Works

Registration is a two-step flow. First, the user submits name, email, and password, and Supabase creates the auth user. A database trigger called `handle_new_user` immediately creates a matching row in `profiles`. Separately, the membership application form on `/get-involved` collects additional information — phone, reason for joining, area of interest, availability — into `membership_applications`.

When an admin clicks "Approve & Grant", the app calls a Postgres function called `approve_membership_application`. That function does five things inside a single transaction: it verifies the caller is an admin, it looks for an existing profile matching the applicant's email, it creates a profile if none exists, it grants access to every free product, and it marks the application as `accepted` and links it to the profile. Because it is a Postgres function, the whole operation is atomic — either every step succeeds or nothing happens.

Login is handled by Supabase Auth via cookies. Middleware protects `/dashboard/*` and `/admin/*` from unauthenticated access. Every admin page and admin API route re-checks `profiles.role === 'admin'` on the server, so a user cannot elevate themselves by editing the client bundle.

## Products and Access

Products come in three types — free, paid, and donation — and each has a media type of video, audio, text, or link. Guests see the product title, cover, and description, but paid content is locked. Members with a row in `product_access` see the actual content: video and audio are streamed through short-lived signed URLs, text is rendered inline, and links open externally.

The inline viewer never receives the signed URL in the initial HTML. Instead, it fetches `/api/product-access/[productId]` on mount, which returns a 60-second signed URL. That URL expires quickly, so even if a member copies and shares it, the link will not work later.

## Manual Payments

There is no payment gateway. When a member clicks a locked paid product, a modal opens showing the admin's bank details — loaded from `settings` — along with a WhatsApp link. The member pays offline, then submits an "I have paid" form, which creates a row in `payment_requests` with status `pending`. The admin sees these pending requests on `/admin/access` and can approve or dismiss them. Approving inserts the grant into `product_access` and marks the request as `approved`. Duplicate pending requests for the same product are blocked at the API level so that the admin queue does not fill up with duplicates.

## File Uploads

Product media and article images are uploaded through server routes — `/api/admin/upload` and `/api/admin/articles/upload`. Both routes verify the caller is an admin, enforce a file size limit, and upload to Supabase Storage using the service-role client. Product uploads go into one of three private buckets (`free-products`, `paid-products`, `donation-products`) depending on the product type. Article images go into a public bucket called `article-media`. Cover thumbnails go into a public bucket called `covers`.

Vercel enforces a 4.5 MB request body limit on serverless functions, so article image uploads are capped at 4 MB. Product uploads are capped at 50 MB in the admin UI, but will fail on Vercel if the file exceeds 4.5 MB. This is a known limitation that will be addressed by switching to direct-to-Supabase signed uploads.

## Real-Time Chat

The chat lives at `/dashboard/chat` and is a single global room. It uses Supabase Realtime to subscribe to `INSERT`, `UPDATE`, and `DELETE` events on the `messages` table. Members can send messages and edit or delete their own. Admins can delete any message. The last fifty messages load when the page opens; older messages are not yet paginated.

Realtime requires the `messages` table to be added to the `supabase_realtime` publication, which is done once via SQL: `alter publication supabase_realtime add table public.messages;`

## Deployment

Every push to `main` triggers a Vercel deploy. Four environment variables are required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `NEXT_PUBLIC_SITE_URL`. The last one is used during registration so the email confirmation link points to production rather than localhost.

When pushing environment variable changes, a forced clean rebuild is required because `NEXT_PUBLIC_*` variables are inlined into the JavaScript bundle at build time. A redeploy that reuses the build cache will still serve the old values.

## What I Learned

Row-Level Security is not optional. The first version of the `settings` table was readable by anyone with the anon key, because the anon key is shipped in the browser bundle and there was no RLS policy stopping it. That is how I discovered that "anon" means exactly what it says.

Views need `security_invoker`. Without it, a view runs with the owner's privileges and quietly bypasses RLS. Supabase flags this in the Advisor Center, and it is easy to overlook until it silently leaks data.

Vercel's 4.5 MB limit is real. Video uploads and large images need a direct-to-storage flow, not a server-side proxy. The first time I tried to upload a 6 MB video, the request never reached my code — Vercel rejected it before the function ran.

Codec support matters. A video encoded as HEVC plays audio but not video in Chrome and Firefox. H.264 with 8-bit color is the safe choice for anything that needs to play in a browser.

Serverless functions need explicit error handling. When a route fails, it does not throw a visible stack trace to the browser — it just returns a 500. Logging the real error server-side, and inspecting the Vercel runtime logs, is what made debugging possible.

## Roadmap

The next improvements are direct-to-Supabase signed uploads to bypass Vercel's 4.5 MB limit, chat pagination and per-room channels, a proper payment gateway (Paystack or Flutterwave) as an alternative to manual approval, automated transcoding for uploaded videos, rate limiting on auth and payment endpoints, and a final SEO metadata pass on the remaining pages.