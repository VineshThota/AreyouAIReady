# Deployment Guide - Are You AI Ready

## Quick Start for Vercel Deployment

### Step 1: Prepare Your Repository

The code is already in a git repository at `/Users/vineshthota/Downloads/are-you-ai-ready/`.

Verify the git status:
```bash
git status
```

### Step 2: Push to GitHub

1. Create a new GitHub repository (if you haven't already)
2. Add the remote and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/are-you-ai-ready.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Option A: Using Vercel Web Interface

1. Go to https://vercel.com/new
2. Select "GitHub" and import your repository
3. Select the project root: `/` (root)
4. In "Environment Variables", add:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=sk-proj-your-openai-api-key-here
   NEXT_PUBLIC_GOOGLE_SHEETS_ID=1BHf7uKm5GokjDCe9dNOtlCsYhntYYZi3p-Pq_kzc3tc
   NEXT_PUBLIC_POSITIONSTACK_API_KEY=d746f10e537ed1b5ec94d2e39f14bdc6
   ```
5. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts to connect your GitHub account and deploy.

### Step 4: Verify Deployment

Once deployed, Vercel will provide you with a URL. Visit it to confirm:
- [ ] Landing page loads with "Start Quiz" button
- [ ] Can navigate to quiz entry screen
- [ ] Quiz questions generate properly
- [ ] Certificate displays correctly

## Post-Deployment Configuration

### Google Sheets API Setup

For full Google Sheets integration (currently logging to console), you'll need to:

1. Create a service account in Google Cloud Console
2. Share the Google Sheet with the service account email
3. Update `/app/api/save-session/route.ts` to use the Google Sheets API

Current implementation logs session data to console. In production, you should:

```typescript
// Add Google Sheets API client
import { google } from 'googleapis';

const sheets = google.sheets('v4');
// Append row to Google Sheet with session data
```

### Environment Variables Security

- Store all sensitive keys in Vercel's Environment Variables section
- Never commit `.env.local` to git
- The `.gitignore` file already excludes it

## Custom Domain Setup

To use a custom domain (e.g., `aiyouready.com`):

1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS instructions
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables

## Monitoring & Analytics

Once deployed, you can:

1. **View logs**: Vercel Dashboard → Deployments → Function Logs
2. **Monitor performance**: Vercel Analytics (Web Vitals)
3. **Check errors**: Vercel Dashboard → Monitoring → Functions

## Session Data Tracking

Currently, session data is:
- Stored in browser's localStorage during quiz
- Attempted to save to Google Sheets (requires API setup)
- Can be extended to store in Supabase, Firebase, or PostgreSQL

To implement full Google Sheets logging:

1. Create Google Cloud project
2. Enable Google Sheets API
3. Create service account key
4. Update `/app/api/save-session/route.ts` with actual Google Sheets API calls

## Troubleshooting

### Questions not generating
- Check OPENAI_API_KEY is correctly set in Vercel
- Monitor API usage in OpenAI dashboard
- Verify quota limits aren't exceeded

### Certificate not rendering
- Ensure html2canvas is properly installed
- Check browser console for DOM issues
- Verify fonts are loaded correctly

### Session not saving
- Check if Google Sheets API is configured
- Verify GOOGLE_SHEETS_ID is correct
- Review Vercel function logs

## Performance Optimization

The app is already optimized for:
- Fast static rendering
- Image optimization via Next.js
- CSS minification
- JavaScript code splitting
- Tailwind CSS purging

For additional optimization:
```bash
npm run build
# Review .next/static directory for bundle size
```

## Security Considerations

1. **API Keys**: All sensitive keys use NEXT_PUBLIC_ prefix (only client-side safe data)
   - Move OpenAI calls to server-side API routes for production
   - Current setup is suitable for demonstration but should be hardened

2. **Certificate IDs**: Generated using nanoid (cryptographically safe)

3. **CORS**: Configure appropriate CORS headers for Google Sheets API

4. **Rate Limiting**: Add rate limiting to `/api/generate-questions` endpoint

## Cost Estimates (Monthly)

- **OpenAI API**: ~$0-50 depending on usage
- **Vercel**: $0-100 depending on function invocations
- **Google Sheets**: Free
- **Positionstack**: Free tier sufficient for typical volume

## Rollback

If you need to rollback to a previous deployment:

1. Vercel Dashboard → Deployments
2. Click the previous deployment
3. Click "Redeploy"

## Next Steps

1. Push code to GitHub
2. Deploy to Vercel via web interface
3. Test all flows in production
4. Collect metrics on usage and performance
5. Consider implementing full Google Sheets logging
6. Add user feedback mechanism
7. Iterate on question quality and profiles

## Support

For Vercel deployment help: https://vercel.com/docs
For Next.js documentation: https://nextjs.org/docs
For OpenAI API issues: https://platform.openai.com/docs
