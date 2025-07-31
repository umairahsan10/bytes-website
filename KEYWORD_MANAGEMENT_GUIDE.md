# 📝 Keyword Management Guide for Non-Technical Users

## 🎯 Overview
This guide shows you how to manage internal linking keywords using simple JSON files. The admin panel has been simplified to focus only on what works - file uploads and management. No technical knowledge required!

## 📋 Weekly Workflow

### Step 1: Download Template
1. Go to `/admin/keywords` in your website
2. Click **"Download Template"** button
3. Save the `keywords-template.json` file

### Step 2: Edit Keywords
1. Open the downloaded file in any text editor (Notepad, TextEdit, etc.)
2. Replace the example keywords with your real ones
3. Follow this format:

```json
{
  "keywords": [
    {
      "keyword": "your keyword here",
      "url": "/blogs/your-blog-post-slug",
      "category": "SEO",
      "description": "Optional description"
    },
    {
      "keyword": "another keyword",
      "url": "/blogs/another-blog-post",
      "category": "Web Development"
    }
  ],
  "version": "1.0",
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

### Step 3: Upload Keywords
1. Go back to `/admin/keywords`
2. Click **"Upload Keywords"**
3. Choose upload mode:
   - **Merge**: Adds new keywords, keeps existing ones (recommended)
   - **Replace**: Replaces all keywords with file content
4. Select your edited JSON file
5. Click upload

## 📝 File Format Rules

### Required Fields
- `keyword`: The word/phrase to link (e.g., "SEO", "web design")
- `url`: Must start with `/blogs/` (e.g., `/blogs/what-is-seo`)

### Optional Fields
- `category`: SEO, Web Development, Mobile Apps, Digital Marketing, or General
- `description`: Any notes about the keyword

### URL Format
- ✅ Correct: `/blogs/what-is-seo`
- ❌ Wrong: `https://yoursite.com/blogs/what-is-seo`
- ❌ Wrong: `/what-is-seo`

## 🔄 Upload Modes Explained

### Merge Mode (Recommended)
- **What it does**: Adds new keywords to existing ones
- **When to use**: Weekly updates, adding new keywords
- **Example**: If you have 50 keywords and upload 10 new ones, you'll have 60 total

### Replace Mode (Use with caution)
- **What it does**: Replaces ALL existing keywords with file content
- **When to use**: Complete keyword overhaul
- **Warning**: This will delete all existing keywords!

## 📊 Example Keywords File

```json
{
  "keywords": [
    {
      "keyword": "search engine optimization",
      "url": "/blogs/what-is-seo",
      "category": "SEO",
      "description": "Main SEO term"
    },
    {
      "keyword": "seo",
      "url": "/blogs/what-is-seo",
      "category": "SEO",
      "description": "SEO abbreviation"
    },
    {
      "keyword": "web development",
      "url": "/blogs/important-web-development-trends",
      "category": "Web Development"
    },
    {
      "keyword": "mobile app",
      "url": "/blogs/how-to-build-scalable-mobile-apps",
      "category": "Mobile Apps"
    }
  ],
  "version": "1.0",
  "lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

## 🚨 Common Mistakes to Avoid

1. **Wrong URL format**: URLs must start with `/blogs/`
2. **Missing quotes**: All text must be in quotes
3. **Extra commas**: Don't put comma after the last item in a list
4. **Wrong file extension**: Save as `.json`, not `.txt`
5. **Special characters**: Avoid special characters in keywords

## 🔧 Troubleshooting

### "Invalid JSON file" error
- Check for missing quotes around text
- Remove extra commas
- Use a JSON validator online

### "Invalid URL format" error
- Make sure URLs start with `/blogs/`
- Check for typos in blog slugs

### "No keywords found" after upload
- Check that your file has the correct structure
- Make sure the `keywords` array exists
- Verify all required fields are present

## 📞 Need Help?

If you encounter issues:
1. Check the error message in the admin panel
2. Verify your JSON file format
3. Try uploading a smaller test file first
4. Use the "Reset to Defaults" button if needed

## 🎉 Success Tips

- Start with a small number of keywords to test
- Use descriptive categories for better organization
- Keep a backup of your keywords file
- Update keywords weekly for best results
- Use merge mode for regular updates
- The simplified interface focuses only on working features

## 🔧 What's Available in the Admin Panel

### ✅ Working Features:
- **Download Template**: Get a ready-to-edit JSON file
- **Upload Keywords**: Bulk upload your keyword files
- **View Keywords**: See all current keywords in a table
- **Remove Keywords**: Delete individual keywords
- **Export Current**: Download your current keywords
- **Reset to Defaults**: Restore original keywords
- **Category Filter**: Filter keywords by category

### ❌ Removed Features (Non-functional):
- Single keyword addition (use file upload instead)
- Content analysis (not needed for file-based workflow)
- Keyword suggestions (focus on manual keyword management) 