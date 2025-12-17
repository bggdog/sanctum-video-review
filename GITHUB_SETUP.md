# GitHub Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Repository name: `video-review-platform` (or any name you prefer)
3. **IMPORTANT:** Leave it **Private** or **Public** (your choice)
4. **DO NOT** check any boxes (README, .gitignore, license)
5. Click "Create repository"

## Step 2: Copy Your Repository URL

After creating the repository, GitHub will show you the URL. It will look like:
- HTTPS: `https://github.com/YOUR_USERNAME/video-review-platform.git`
- SSH: `git@github.com:YOUR_USERNAME/video-review-platform.git`

**Copy the HTTPS URL** (it starts with `https://`)

## Step 3: Set Up Git Remote

In your terminal, run (replace with YOUR actual URL):

```bash
git remote add origin https://github.com/YOUR_USERNAME/video-review-platform.git
```

Replace `YOUR_USERNAME` and `video-review-platform` with your actual values.

## Step 4: Authenticate with GitHub

GitHub requires a Personal Access Token (not password) for HTTPS.

### Option A: Use GitHub CLI (Easiest)
```bash
# Install GitHub CLI if you don't have it
brew install gh

# Login to GitHub
gh auth login

# Follow the prompts to authenticate
```

Then you can push normally:
```bash
git push -u origin main
```

### Option B: Use Personal Access Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "Video Review Platform"
4. Select scopes: Check `repo` (gives full repository access)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

When you push, use the token as your password:
```bash
git push -u origin main
# Username: YOUR_GITHUB_USERNAME
# Password: PASTE_YOUR_TOKEN_HERE
```

### Option C: Use SSH (Most Secure)

1. Generate SSH key (if you don't have one):
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Add SSH key to GitHub:
   - Copy your public key: `cat ~/.ssh/id_ed25519.pub`
   - Go to https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your key and save

3. Use SSH URL instead:
```bash
git remote set-url origin git@github.com:YOUR_USERNAME/video-review-platform.git
git push -u origin main
```

## Step 5: Push Your Code

Once authenticated, run:
```bash
git push -u origin main
```

## Troubleshooting

If you still get authentication errors:
- Make sure you've replaced `YOUR_USERNAME` and `REPO_NAME` in the URL
- Verify the repository exists on GitHub
- Try using GitHub CLI: `gh auth login`
- Or use SSH instead of HTTPS

