# 🎉 One-Time Webhook Setup for Sanity Blogs

This setup ensures your blogs appear **instantly** on your website whenever you publish in Sanity. No more ISR delays!

## ✅ What I've Already Done

1. ✅ Created `/api/revalidate` endpoint that Next.js will use for on-demand revalidation
2. ✅ Updated blog pages to use webhooks (with 1-hour ISR as backup)
3. ✅ Created `.env.local` template

---

## 🔧 Setup Steps (5 minutes)

### Step 1: Create Your Secret Key

1. Create a file called `.env.local` in the `bytes-website` folder (next to package.json)
2. Add this content (change the secret to something unique):

```bash
# Revalidation Secret for Sanity Webhooks
REVALIDATE_SECRET=your-super-secret-webhook-key-change-this-to-something-random-12345

# Your other environment variables can go below
```

**Important:** Make this secret at least 32 characters long and random. You can use something like:
```
REVALIDATE_SECRET=sk_live_blog_webhook_2024_secure_random_string_abc123xyz
```

### Step 2: Deploy to Vercel/Production

1. **Deploy your code:**
   ```bash
   cd bytes-website
   git add .
   git commit -m "Add webhook support for instant blog updates"
   git push
   ```

2. **Add the secret to Vercel:**
   - Go to your Vercel project → Settings → Environment Variables
   - Add: `REVALIDATE_SECRET` with the same value from your `.env.local`
   - Redeploy if necessary

### Step 3: Configure Sanity Webhook

1. **Go to Sanity Dashboard:**
   - Visit: https://www.sanity.io/manage
   - Select your project

2. **Create a new webhook:**
   - Go to **API → Webhooks → Add webhook**
   
3. **Configure the webhook:**
   - **Name:** `Production Blog Revalidation`
   - **URL:** `https://YOUR-DOMAIN.com/api/revalidate?secret=YOUR_SECRET_KEY`
     - Replace `YOUR-DOMAIN.com` with your actual domain (e.g., `yourbytes.vercel.app`)
     - Replace `YOUR_SECRET_KEY` with your actual secret from `.env.local`
   
   - **Dataset:** `production` (or your dataset name)
   - **Trigger on:** Check these boxes:
     - ✅ Create
     - ✅ Update
     - ✅ Delete
   
   - **Filter (optional but recommended):** Add this to only trigger for blog posts:
     ```groq
     _type == "post"
     ```
   
   - **HTTP method:** `POST`
   - **API version:** Use the latest (e.g., `v2024-01-01`)

4. **Save the webhook**

---

## 🧪 Test Your Setup

### Test 1: Manual Test (in browser)
Visit this URL in your browser (replace with your values):
```
https://YOUR-DOMAIN.com/api/revalidate?secret=YOUR_SECRET_KEY
```

You should see:
```json
{
  "revalidated": true,
  "now": 1234567890,
  "message": "Manual revalidation successful"
}
```

### Test 2: Publish a Blog Post
1. Go to Sanity Studio
2. Create or update a blog post
3. Publish it
4. Wait 5-10 seconds
5. Check your website - the blog should appear immediately!

---

## 🔍 Troubleshooting

### Blogs still not showing?

1. **Check webhook delivery:**
   - In Sanity Dashboard → API → Webhooks
   - Click on your webhook
   - Check the "Deliveries" tab to see if webhooks are being sent
   - Look for any errors (401 = wrong secret, 500 = server error)

2. **Check your secret:**
   - Make sure it matches exactly in:
     - `.env.local` (local development)
     - Vercel Environment Variables (production)
     - Sanity webhook URL

3. **Check Vercel logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment → Functions → `/api/revalidate`
   - Check for any error messages

4. **Verify the webhook URL:**
   - Make sure it's your production domain (not localhost)
   - Include the `?secret=...` query parameter
   - Use `https://` not `http://`

### Common Issues

- **401 Unauthorized**: Secret key doesn't match
- **404 Not Found**: URL is wrong or code not deployed
- **500 Server Error**: Check Vercel function logs for the actual error

---

## 📝 How It Works

```
1. You publish a blog post in Sanity
   ↓
2. Sanity sends a webhook to your /api/revalidate endpoint
   ↓
3. Next.js revalidates the blog pages
   ↓
4. New content appears immediately (within 1-2 seconds)
```

**Backup:** If the webhook fails for any reason, the 1-hour ISR will still refresh your content automatically.

---

## 🎯 Next Steps

Once everything works:
1. ✅ Delete this file (WEBHOOK_SETUP.md) if you want
2. ✅ Celebrate - you'll never have to worry about ISR timing again!
3. ✅ Optional: Add webhooks for other content types (products, pages, etc.)

---

## 💡 Pro Tips

- **Multiple environments?** Create separate webhooks for staging/production
- **Want to revalidate specific pages?** Modify `/api/revalidate/route.ts`
- **Need to manually revalidate?** Just visit the test URL from "Test 1" above
- **Want notifications?** Add logging or send yourself an email in the route handler

---

**Questions?** Check the deployment logs in Vercel or the webhook delivery logs in Sanity.

