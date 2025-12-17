# Vercel Deployment Troubleshooting

## Common Server Error Causes

### 1. Missing or Incorrect Environment Variables

**Check in Vercel Dashboard:**
- Go to your project → Settings → Environment Variables
- Make sure ALL these variables are set:

```
NEXTAUTH_URL=https://your-actual-vercel-url.vercel.app
NEXTAUTH_SECRET=7AR6pBYiOFyJYIl9egfyruDZd8lnDGQs/pmRo5e2/ro=
NEXT_PUBLIC_SUPABASE_URL=https://oykicubbbpkzsflvizcs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95a2ljdWJiYnBrenNmbHZpemNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODMyNzQsImV4cCI6MjA4MTU1OTI3NH0.dVtC5aBV1nVXtLo2b7snXlUmfYX95tTa3ogfG0dBEuo
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95a2ljdWJiYnBrenNmbHZpemNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTk4MzI3NCwiZXhwIjoyMDgxNTU5Mjc0fQ.z4ZLKYchbKVFFsN-IKmplzw8CAyFx0-bHi-pV3YxwIA
```

**⚠️ CRITICAL:** Replace `https://your-actual-vercel-url.vercel.app` with your ACTUAL Vercel deployment URL!

### 2. Check Vercel Deployment Logs

1. Go to Vercel Dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click on the latest deployment
5. Check the "Build Logs" and "Function Logs" for errors

### 3. Common Issues:

#### Issue: "Missing NEXTAUTH_SECRET"
**Solution:** Make sure `NEXTAUTH_SECRET` is set in Vercel environment variables

#### Issue: "NEXTAUTH_URL mismatch"
**Solution:** Update `NEXTAUTH_URL` to match your Vercel deployment URL exactly (including `https://`)

#### Issue: "Cannot connect to Supabase"
**Solution:** 
- Verify Supabase URL and keys are correct
- Check that your Supabase project is active
- Ensure RLS policies allow access

#### Issue: Runtime errors
**Solution:** Check the Function Logs in Vercel for specific error messages

## Quick Fix Steps:

1. **Get your Vercel URL:**
   - Go to Vercel Dashboard → Your Project
   - Copy the deployment URL (e.g., `https://sanctum-video-review.vercel.app`)

2. **Update NEXTAUTH_URL:**
   - Go to Settings → Environment Variables
   - Find `NEXTAUTH_URL`
   - Update it to: `https://your-actual-url.vercel.app`
   - Click "Save"

3. **Redeploy:**
   - Go to Deployments tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - OR push a new commit to trigger auto-deploy

## Still Having Issues?

Share the error message from:
1. Vercel Function Logs (Dashboard → Deployments → Latest → Functions)
2. Browser console (F12 → Console tab)
3. Network tab errors (F12 → Network tab)

