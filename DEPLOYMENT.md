# Deployment Guide - Sanctum Creative

## Free Deployment with Vercel

This guide will help you deploy your Video Review Platform to Vercel for free, while still being able to edit in Cursor.

### Prerequisites
- GitHub account (free)
- Vercel account (free)
- Your Supabase credentials (already have these)

## Step 1: Initialize Git Repository

1. Open terminal in your project directory
2. Run these commands:

```bash
git init
git add .
git commit -m "Initial commit"
```

## Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (e.g., `video-review-platform`)
3. **DO NOT** initialize with README, .gitignore, or license (we already have these)
4. Copy the repository URL

## Step 3: Push to GitHub

Run these commands (replace `YOUR_USERNAME` and `REPO_NAME` with your actual values):

```bash
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/Sign in with your GitHub account (recommended)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js settings

## Step 5: Configure Environment Variables

In Vercel project settings, add these environment variables:

```
# NextAuth
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=your-secret-key-here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important:** 
- Generate a new `NEXTAUTH_SECRET` for production: You can run `openssl rand -base64 32` in terminal
- Update `NEXTAUTH_URL` to your actual Vercel deployment URL after first deploy

## Step 6: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Your site will be live at `https://your-project.vercel.app`

## Ongoing Development Workflow

### To Make Changes:

1. **Edit in Cursor** - Make your changes locally
2. **Test Locally** - Run `npm run dev` to test
3. **Commit Changes**:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
4. **Auto-Deploy** - Vercel automatically deploys when you push to GitHub!

### Vercel Free Tier Includes:

- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Custom domains (optional)
- ✅ Environment variables
- ✅ Automatic deployments from GitHub
- ✅ Preview deployments for pull requests
- ✅ Analytics (limited)

## Updating Environment Variables

If you need to update environment variables:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update variables
3. Redeploy (or it will auto-deploy on next push)

## Troubleshooting

### Build Fails
- Check the build logs in Vercel dashboard
- Make sure all environment variables are set
- Run `npm run build` locally to test

### Environment Variables Not Working
- Make sure they're set in Vercel (not just locally)
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check Supabase project is active
- Verify RLS policies allow access

## Alternative: Netlify (Also Free)

If you prefer Netlify:
1. Sign up at https://netlify.com
2. Connect GitHub repository
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add environment variables in Site settings

Both Vercel and Netlify are excellent choices for Next.js!

