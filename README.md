# Moodloop — Setup Guide

## Step 1: Supabase (your database)
1. Go to supabase.com → open your project
2. Click "SQL Editor" in the left sidebar
3. Click "New query"
4. Open the file `SUPABASE_SETUP.sql` from this repo
5. Copy everything, paste it, click "Run"
6. Go to Settings → API → copy your Project URL and anon key
7. Open `src/lib/supabase.js` and replace:
   - `YOUR_SUPABASE_URL` with your Project URL
   - `YOUR_SUPABASE_ANON_KEY` with your anon key

## Step 2: Gemini AI (free emotion detection)
1. Go to aistudio.google.com
2. Click "Get API Key" → "Create API key"
3. Copy the key
4. Open `src/lib/gemini.js` and replace `YOUR_GEMINI_API_KEY` with your key

## Step 3: GitHub upload
1. Go to your github.com/YOUR_USERNAME/moodloop repo
2. Click "uploading an existing file"
3. Drag ALL these files into the upload area
4. Click "Commit changes"

## Step 4: Connect Expo EAS to GitHub
1. Go to expo.dev → your account → New Project → name it moodloop
2. Copy the project ID
3. Open app.json and replace YOUR_EAS_PROJECT_ID with it
4. In Expo dashboard → go to your project → GitHub → Connect → select moodloop repo

## Step 5: Build your APK
1. In Expo dashboard → Builds → New Build
2. Select Android → Preview profile (gives you APK)
3. Wait 10-15 minutes → download your APK
4. Test it on your phone by installing the APK directly

## Step 6: Google Play submission
1. Go to play.google.com/console → create account (₹1,700 one time)
2. Create new app → upload the APK
3. Fill in store listing (I'll help you with this)

## Files in this project
- App.js — main entry point
- src/screens/ — all app screens
- src/lib/supabase.js — database connection (ADD YOUR KEYS HERE)
- src/lib/gemini.js — AI emotion detection (ADD YOUR KEY HERE)
- src/lib/theme.js — colors and design
- SUPABASE_SETUP.sql — run this in Supabase SQL editor
