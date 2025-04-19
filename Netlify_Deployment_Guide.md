# Netlify Deployment Guide

This guide will walk you through deploying the Real Address Generator application on Netlify.

## Prerequisites

1. A GitHub account
2. A Netlify account (free tier is sufficient)
3. A fork of this repository

## Step 1: Fork the Repository

1. Visit [https://github.com/therayyanawaz/ip](https://github.com/therayyanawaz/ip)
2. Click the "Fork" button in the top right to create your own copy
3. Wait for the forking process to complete

## Step 2: Connect to Netlify

1. Log in to your [Netlify account](https://app.netlify.com/)
2. Click "Add new site" > "Import an existing project"
3. Choose "GitHub" as your Git provider
4. Authorize Netlify to access your GitHub account if prompted
5. Select your forked repository from the list

## Step 3: Configure Deployment Settings

1. In the site settings page, configure:
   - **Branch to deploy**: `main` (or your preferred branch)
   - **Base directory**: Leave empty (root of the repository)
   - **Build command**: `npm run build:netlify` (this is already in netlify.toml)
   - **Publish directory**: `.next` (this is already in netlify.toml)

2. Click "Deploy site"

## Step 4: Set Environment Variables (if needed)

If your application requires any environment variables:

1. Go to "Site settings" > "Environment variables"
2. Add any required variables:
   - No specific environment variables are required for this application

## Step 5: Wait for Deployment

1. Netlify will now build and deploy your site
2. This process typically takes 2-5 minutes
3. You can monitor the deployment process in the "Deploys" tab

## Step 6: Configure Domain (Optional)

1. After successful deployment, Netlify assigns a random domain (e.g., `random-name-123456.netlify.app`)
2. To set a custom domain:
   - Go to "Site settings" > "Domain management"
   - Click "Add custom domain"
   - Follow the prompts to set up your domain

## Troubleshooting

### Handling TypeScript Errors

If you encounter TypeScript errors during build:

1. The project is configured to ignore TypeScript errors during build with:
   ```
   // In next.config.ts
   typescript: {
     ignoreBuildErrors: true,
   }
   ```

2. If you want to fix the TypeScript errors locally:
   - Run `npm run type-check` to see all TypeScript errors
   - Fix the errors in the specified files (especially check `app/components/AddressInfo.tsx`, `app/components/InboxDialog.tsx`, and `app/page.tsx`)
   - Common errors include:
     - Unexpected `any` types
     - Unused variables
     - Missing dependencies in React Hooks

### Build Failures

If your build still fails:

1. **Go Version Issues**: The `netlify.toml` file sets `GO_VERSION = ""` to avoid Go-related errors
2. **Node.js Version**: Make sure Node.js version 20 is being used (set in `netlify.toml`)
3. **Plugin Errors**: Check that `@netlify/plugin-nextjs` is installed correctly

## Updating Your Deployment

To update your deployment after making changes:

1. Push changes to your GitHub repository
2. Netlify will automatically detect the changes and trigger a new deployment
3. Monitor the deployment in the "Deploys" tab

## Support

If you need help with deployment, you can:
- Check [Netlify's documentation](https://docs.netlify.com/)
- Visit the [Netlify forums](https://answers.netlify.com/)
- Open an issue in the [original repository](https://github.com/therayyanawaz/ip/issues) 