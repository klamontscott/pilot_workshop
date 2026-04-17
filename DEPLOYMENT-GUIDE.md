# Deployment Guide

This guide covers deploying your portfolio to production.

## Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Blender model is exported and working
- [ ] All interactive objects are functioning
- [ ] Case study link is updated to your Framer portfolio
- [ ] Goodreads link is updated to your profile
- [ ] Your photos are added to the gallery
- [ ] Navigation links are functional
- [ ] Performance is good (60fps, fast load)
- [ ] Tested in Chrome, Safari, Firefox

## Option 1: Vercel (Recommended)

Vercel is the easiest and fastest deployment option with automatic builds and previews.

### Setup

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd portfolio
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? keith-scott-portfolio (or your choice)
   - Directory? `./`
   - Override settings? No

5. **Your site is live!** Vercel will give you a URL like:
   `https://keith-scott-portfolio.vercel.app`

### Custom Domain

1. In Vercel dashboard, go to your project
2. Settings → Domains
3. Add your custom domain (e.g., `keithscott.com`)
4. Follow DNS configuration instructions
5. Vercel handles SSL certificates automatically

### Future Deployments

Simply run `vercel --prod` to deploy to production.

Vercel also:
- Auto-deploys on git push (if connected to GitHub)
- Provides preview URLs for every commit
- Includes built-in analytics
- Has excellent performance optimization

## Option 2: Netlify

1. **Build your site:**
   ```bash
   npm run build
   ```

2. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

3. **Deploy:**
   ```bash
   netlify deploy --dir=dist --prod
   ```

4. **Or use drag-and-drop:**
   - Go to https://app.netlify.com/drop
   - Drag your `dist` folder
   - Get instant URL

### Custom Domain on Netlify

1. In Netlify dashboard, go to Site settings
2. Domain management → Add custom domain
3. Follow DNS instructions
4. SSL is automatic

## Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install -D gh-pages
   ```

2. **Add to package.json:**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/portfolio"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Enable in GitHub:**
   - Go to repository Settings
   - Pages → Source → gh-pages branch
   - Your site will be at: `https://yourusername.github.io/portfolio`

## Option 4: Custom Server

If you have your own hosting:

1. **Build:**
   ```bash
   npm run build
   ```

2. **Upload `dist/` folder** to your server

3. **Configure web server:**
   - For Apache, use provided `.htaccess`
   - For Nginx, configure rewrites for SPA

## Environment Variables

If you add API keys or analytics tokens:

1. Create `.env.local`:
   ```
   VITE_ANALYTICS_ID=your_id_here
   VITE_GOODREADS_API=your_key_here
   ```

2. Access in code:
   ```typescript
   const analyticsId = import.meta.env.VITE_ANALYTICS_ID
   ```

3. Add to Vercel/Netlify environment variables in dashboard

## Analytics Integration

### Vercel Analytics

1. Install:
   ```bash
   npm install @vercel/analytics
   ```

2. Add to `App.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react'
   
   function App() {
     return (
       <>
         <Scene />
         <Analytics />
       </>
     )
   }
   ```

### Plausible Analytics

1. Add to `index.html` in `<head>`:
   ```html
   <script defer data-domain="yourdomain.com" 
     src="https://plausible.io/js/script.js"></script>
   ```

2. Track events:
   ```typescript
   // @ts-ignore
   window.plausible?.('Computer Click')
   ```

## Post-Deployment

### Test Your Deployment

1. **Check all interactions:**
   - Computer → Case studies
   - Bookshelf → Goodreads
   - Camera → Photo gallery
   - Basketball → Game works
   - Light → Toggles properly

2. **Performance:**
   - Run Lighthouse in Chrome DevTools
   - Aim for 90+ performance score
   - Check load time < 3 seconds

3. **Cross-browser:**
   - Test in Chrome, Safari, Firefox
   - Check on different screen sizes

### Share Your Portfolio

Once deployed:

1. **Update LinkedIn:** Add portfolio URL
2. **Update Resume:** Include link
3. **Tweet about it:** Share screenshots, build process
4. **Tag inspirations:** @PrestonBooth, etc.

## Monitoring

### Check Analytics Weekly

- Which objects get most clicks?
- How long do people stay?
- Are they clicking through to case studies?

### Iterate Based on Data

- If basketball game is popular, enhance it
- If case study clicks are low, make computer more prominent
- If bounce rate is high, improve loading experience

## Troubleshooting

### 3D Model Not Loading

- Check file is in `public/models/workspace.glb`
- Verify file size (<10MB)
- Check browser console for errors

### Slow Loading

- Enable Draco compression on model export
- Optimize textures (reduce size)
- Check Network tab in DevTools

### Poor Performance

- Lower model polygon count
- Reduce texture resolution
- Disable shadows if needed
- Check browser console for warnings

## Rollback

If deployment has issues:

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
- Go to Deploys in dashboard
- Click "Publish deploy" on previous version

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com
- Performance: https://web.dev/vitals

---

**Remember:** Your first deployment doesn't need to be perfect. Ship it, get feedback, iterate!
