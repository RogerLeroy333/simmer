# Deploying Simmer

## 1. Set up Supabase (5 min)
1. Go to supabase.com and sign up (free)
2. Create a new project called "simmer"
3. Once it's ready, go to SQL Editor
4. Paste the contents of `supabase-schema.sql` and run it
5. Go to Settings → API and copy your:
   - Project URL (looks like https://abc123.supabase.co)
   - Anon/public key

## 2. Get an Anthropic API key (2 min)
1. Go to console.anthropic.com
2. Sign up and add $5 credits
3. Go to API Keys and create one

## 3. Deploy to Vercel (3 min)
1. Push this code to a GitHub repo (or I can help with that)
2. Go to vercel.com → New Project → Import your repo
3. In Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
   - `ANTHROPIC_API_KEY` = your Anthropic API key
4. Click Deploy

## 4. Install on your phone
1. Open your Vercel URL on your phone (Safari on iPhone)
2. Tap the Share button → "Add to Home Screen"
3. It'll appear as an app icon called "Simmer"

## Sharing with friends
Just text them the URL. They open it, add to home screen, done.
