# Authentication Debugging Guide

## Issue: Email/Password Getting Rejected

### Possible Causes:

1. **Users don't exist in Supabase**
   - The users were created locally using the script
   - Verify they exist in your Supabase dashboard

2. **Supabase Environment Variables Not Set Correctly in Vercel**
   - Check Vercel Dashboard → Settings → Environment Variables
   - Verify these are set:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Wrong Credentials**
   - Double-check the email and password you're using

## Steps to Debug:

### 1. Check Vercel Function Logs

1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Go to "Functions" tab
4. Try logging in again
5. Check the logs for error messages

You should see detailed error messages from the improved logging.

### 2. Verify Users Exist in Supabase

1. Go to your Supabase dashboard
2. Navigate to Authentication → Users
3. Check if your users exist there
4. If not, run the create-users script again:
   ```bash
   node scripts/create-users.js
   ```

### 3. Verify Environment Variables

Make sure these are set in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL` = `https://oykicubbbpkzsflvizcs.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)
- `SUPABASE_SERVICE_ROLE_KEY` = (your service role key)
- `NEXTAUTH_SECRET` = `7AR6pBYiOFyJYIl9egfyruDZd8lnDGQs/pmRo5e2/ro=`
- `NEXTAUTH_URL` = `https://sanctum-video-review.vercel.app`

### 4. Test Locally First

Try logging in locally to verify it works:
```bash
npm run dev
```

If it works locally but not in production, it's likely an environment variable issue.

### 5. Common Errors:

- **"Invalid email or password"** - Credentials are wrong OR user doesn't exist
- **"Missing Supabase environment variables"** - Environment variables not set in Vercel
- **"Failed to create Supabase client"** - Supabase URL or key is incorrect

