# How to Create a GitHub Personal Access Token

## Quick Steps:

1. **Direct Link**: Go to: https://github.com/settings/tokens

2. **Or Navigate Manually**:
   - Click your profile picture (top right) on GitHub
   - Click "Settings"
   - Scroll down in the left sidebar
   - Click "Developer settings" (at the bottom)
   - Click "Personal access tokens"
   - Click "Tokens (classic)"

3. **Generate New Token**:
   - Click "Generate new token"
   - Select "Generate new token (classic)"
   - Give it a name: `Sanctum Video Review` (or any name)
   - Set expiration (or "No expiration" if you want)
   - **IMPORTANT**: Check the `repo` checkbox (this gives full repository access)
   - Scroll down and click "Generate token"

4. **Copy the Token**:
   - GitHub will show you the token ONCE
   - Copy it immediately (it looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`)
   - Save it somewhere safe (you'll need it when pushing)

5. **Use the Token**:
   When you run `git push -u origin main`, it will ask for:
   - Username: `bggdog`
   - Password: **paste your token here** (not your actual password!)

## Alternative: Use GitHub CLI (Easier!)

Instead of tokens, you can install GitHub CLI which handles authentication automatically:

```bash
brew install gh
gh auth login
```

Then just run:
```bash
git push -u origin main
```

This is much easier and handles authentication automatically!


