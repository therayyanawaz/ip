# Cloudflare Pages Deployment Guide

## 1. Fork Project Repository

1. Visit [ip](https://github.com/therayyanawaz/ip)
2. Click the "Fork" button in the top right to create your own copy

## 2. Deploy in Cloudflare

### 2.1 Prerequisites
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Find and click "Pages" in the left menu
3. Click the "Connect to Git" button
4. Follow the prompts to link your GitHub account

### 2.2 Create Project
1. Select the repository you just forked
2. Click "Start Setup"
3. On the project configuration page:
   - Framework preset: Select `Next.js` (**Note: Do not select Next.js Static HTML Export**)

> Tip: You might get an error message on the first deployment, which is normal. Follow step 2.3 to enable Node.js compatibility and redeploy to resolve the issue.

### 2.3 Enable Node.js Compatibility
1. After deployment, go to project settings
2. Under "Runtime", find "Compatibility Flags" and enter `nodejs_compat`.

### 2.4 Complete Deployment
1. Return to the "Deployments" page
2. Click the "Redeploy" button
3. Wait for deployment to complete, then visit the assigned domain to use the application

## 3. Sync Updates (Optional)

If you want to manually keep in sync with the original repository:

1. Regularly visit your fork repository
2. Click the "Sync fork" button, refer to GitHub's official guide [Syncing a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)
3. Select "Update branch"

Thanks to [HirasawaYui](https://linux.do/u/HirasawaYui/summary) from LinuxDo forum for providing the GitHub Action

If you want to automatically stay synchronized with the original repository:

1. Create a new workflow in GitHub Actions
2. Create a sync.yml file:
```yaml
name: Sync Fork

on:
  schedule:
    - cron: '0 0 * * *'  # Run once daily
  workflow_dispatch:     # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Fork Repository
      uses: actions/checkout@v3
      with:
        ref: main

    - name: Set Git User Info
      run: |
        git config --global user.name "github-actions[bot]"
        git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"

    - name: Add Upstream
      run: |
        git remote add upstream https://github.com/therayyanawaz/ip
        git fetch upstream

    - name: Merge Upstream Changes
      run: |
        git merge upstream/main --allow-unrelated-histories --no-edit

    - name: Push Changes to Fork
      run: |
        git push origin main
```