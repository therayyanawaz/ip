# Vercel Deployment Guide

This guide provides instructions for deploying this Next.js application to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Git repository connected to GitHub, GitLab, or Bitbucket (recommended)

## Deployment Steps

### Option 1: Deploy from Git Repository (Recommended)

1. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Select the repository for this project

2. **Configure Project**:
   - Project Name: Set your preferred project name
   - Framework Preset: Next.js (should be auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Configure Environment Variables** (if needed):
   - Add any environment variables your application requires
   - Ensure sensitive data is properly secured

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Option 2: Deploy using Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from Local Project**:
   ```bash
   # In the project directory
   vercel
   ```

4. **Follow the CLI prompts to configure your deployment**.

## Automatic Deployments

Once connected to a Git repository, Vercel will automatically:
- Deploy a preview for each pull request
- Deploy to production when changes are pushed to your main branch

## Custom Domains

1. Go to your project in the Vercel Dashboard
2. Navigate to "Settings" > "Domains"
3. Add your custom domain and follow the verification steps

## Troubleshooting

If you encounter any issues during deployment:

1. Check the build logs in the Vercel Dashboard
2. Ensure all dependencies are correctly specified in package.json
3. Verify that your application works locally with `npm run build && npm start`
4. Check that any required environment variables are configured

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment) 