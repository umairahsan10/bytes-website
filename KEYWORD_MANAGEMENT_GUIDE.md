# 🔗 Internal Linking Keyword Management Guide

## 📋 **Current System Overview**

### **How It Works:**
1. **Temporary Storage**: Keywords are stored in browser localStorage
2. **Immediate Effect**: Changes work immediately on the website
3. **Code Updates**: You need to manually update code files for permanent changes

---

## 🚀 **Complete Workflow**

### **Step 1: Upload Keywords**
1. Go to `/admin/keywords`
2. Click "Upload Keywords"
3. Select "Merge" or "Replace" mode
4. Upload your JSON file
5. Click "Merge Keywords" or "Replace Keywords"

### **Step 2: Code Update (Required for Permanent Changes)**
After uploading, you'll see a **"Code Update Required"** section:

1. **Copy the generated code** (click "Copy Code" button)
2. **Open** `src/lib/internalLinking.ts`
3. **Find** the `keywordToUrlMap` object (around line 5)
4. **Replace** the entire object with the copied code
5. **Save** the file

### **Step 3: Deploy Changes**
- Commit and push your code changes
- Deploy to your hosting platform

---

## 📁 **File Format**

### **JSON Template Structure:**
```json
{
  "keywords": [
    {
      "keyword": "your keyword",
      "url": "/blogs/your-blog-slug",
      "category": "SEO",
      "description": "Optional description"
    }
  ],
  "version": "1.0",
  "lastUpdated": "2024-01-01T00:00:00.000Z"
}
```

### **Rules:**
- ✅ **URLs must start with** `/blogs/`
- ✅ **Keywords are case-insensitive**
- ✅ **One keyword per entry**
- ✅ **Valid JSON format required**

---

## 🔄 **Upload Modes**

### **Merge Mode** (Recommended)
- ✅ **Adds new keywords**
- ✅ **Keeps existing keywords**
- ✅ **Shows code update for permanent changes**
- ✅ **Safe for weekly updates**

### **Replace Mode**
- ⚠️ **Replaces ALL keywords**
- ⚠️ **Removes existing keywords**
- ⚠️ **Use with caution**

---

## 🛠️ **Remove Button Behavior**

### **What it does:**
- ✅ Removes from browser storage
- ✅ Updates website immediately
- ✅ Updates admin panel display

### **What it doesn't do:**
- ❌ **Does NOT update code files**
- ❌ **Changes are lost on browser clear**

### **To permanently remove:**
1. Remove via admin panel
2. Update code file manually
3. Deploy changes

---

## 📊 **Weekly Workflow for Non-Technical Users**

### **Option 1: Admin Panel Only (Temporary)**
1. Upload JSON file weekly
2. Changes work immediately
3. **Note**: Changes reset if browser is cleared

### **Option 2: Complete Workflow (Permanent)**
1. Upload JSON file weekly
2. Copy generated code
3. Send code to developer
4. Developer updates `src/lib/internalLinking.ts`
5. Deploy changes

---

## 🚨 **Important Notes**

### **Temporary vs Permanent:**
- **localStorage**: Temporary, works immediately
- **Code files**: Permanent, requires deployment

### **Browser Dependencies:**
- Changes only work in the browser where you made them
- Different devices/browsers see different keywords
- Code updates make changes permanent for all users

### **Backup Strategy:**
- Always export current keywords before major changes
- Keep JSON files as backups
- Version control your code changes

---

## 🔧 **Troubleshooting**

### **Keywords not appearing:**
1. Check if code was updated and deployed
2. Clear browser cache
3. Verify JSON format is correct

### **Remove button not working:**
1. Refresh the admin panel
2. Check browser console for errors
3. Try removing from a different browser

### **Code update not showing:**
1. Make sure you're in "Merge" mode
2. Check if file upload was successful
3. Refresh the page and try again

---

## 📞 **Support**

If you encounter issues:
1. Check the browser console for errors
2. Verify your JSON file format
3. Ensure URLs start with `/blogs/`
4. Contact your developer for code updates

---

## 🎯 **Best Practices**

1. **Use Merge mode** for weekly updates
2. **Always backup** before major changes
3. **Test changes** on a staging environment
4. **Keep JSON files organized** by date
5. **Update code files** for permanent changes
6. **Monitor internal linking** performance 