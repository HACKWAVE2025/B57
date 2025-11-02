# Quick Start - Testing n8n Weekly Email

## 🚀 3-Minute Setup

### Step 1: Set Up n8n (2 minutes)

1. **Go to your n8n**: https://akshayjuluri.app.n8n.cloud
2. **Import workflow**: 
   - Click "Workflows" → "Import from File"
   - Select: `n8n-workflows/weekly-progress-email-with-webhook.json`
3. **Configure email**:
   - Click "Send Email" node → Credentials → Create SMTP
   - Enter your email settings (Gmail, Outlook, etc.)
4. **Activate**: Toggle "Active" switch ON (top right)

✅ Done! Your webhook is now live at: `https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz`

---

## 🧪 Test Methods

### Method 1: Quick Browser Test (Easiest)

**Test the webhook directly:**

1. Open browser console (F12)
2. Paste and run this code (replace email):

```javascript
fetch('https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user: {
      email: 'your-email@example.com', // CHANGE THIS
      username: 'Test User',
      weekNumber: 15,
      currentStreak: 7,
      completedTasksThisWeek: 5,
      totalTasks: 20,
      completedTasks: 15
    }
  })
})
.then(r => r.json())
.then(d => console.log('✅ Success!', d))
.catch(e => console.error('❌ Error:', e));
```

3. Check your email inbox!

---

### Method 2: Test from Your App (Recommended)

**Add the test component:**

1. **Add to a route** (e.g., in your router or settings page):

```typescript
import { TestN8NEmail } from '../components/TestN8NEmail';

// In your route component:
<TestN8NEmail />
```

2. **Or add to App.tsx temporarily:**

```typescript
import { TestN8NEmail } from './components/TestN8NEmail';

function AuthenticatedApp() {
  // ... existing code ...
  
  return (
    <div>
      {/* Add this anywhere */}
      <TestN8NEmail />
      
      {/* ... rest of your app */}
    </div>
  );
}
```

3. **Run your app**: `npm run dev`
4. **Click "Send Test Email" button**
5. **Check your email!**

---

### Method 3: Enable Automatic Weekly Emails

**Add to App.tsx** (after testing):

```typescript
import { useWeeklyProgressEmail } from './hooks/useWeeklyProgressEmail';

function AuthenticatedApp() {
  // Add this line
  useWeeklyProgressEmail(); // Sends email automatically on Mondays
  
  // ... rest of your code
}
```

---

## ✅ Verification Checklist

After testing, verify:

- [ ] n8n workflow is "Active"
- [ ] Webhook URL works (Method 1 test)
- [ ] Test component works (Method 2)
- [ ] Email received in inbox
- [ ] Email contains your data
- [ ] No errors in browser console
- [ ] No errors in n8n execution logs

---

## 🔧 Troubleshooting

### "Webhook not found"
- ✅ Ensure workflow is "Active" in n8n
- ✅ Check webhook path is `qhUVlmQv0SFYAMrz`

### "Email not sending"
- ✅ Check SMTP credentials in n8n
- ✅ Verify email address is correct
- ✅ Check spam folder

### "No data in email"
- ✅ Make sure you're logged in
- ✅ Check Firestore has your user data
- ✅ Open browser console and check for errors

### "CORS error"
- ✅ n8n cloud handles CORS automatically
- ✅ If testing locally, may need CORS config

---

## 📝 What Data is Sent?

The integration automatically collects:
- ✅ User info (email, username)
- ✅ Tasks (total, completed, pending)
- ✅ Streaks (current, longest)
- ✅ Interviews (count, scores)
- ✅ Achievements
- ✅ Week information

---

## 🎯 Next Steps

1. ✅ Test with Method 1 (quick browser test)
2. ✅ Test with Method 2 (app component)
3. ✅ Add `useWeeklyProgressEmail()` for automatic emails
4. ✅ Wait for Monday or trigger manually
5. ✅ Enjoy your weekly progress emails! 🎉

---

## 💡 Pro Tips

- **Test first** with Method 1 to verify n8n is working
- **Check n8n executions** to see data flow
- **Monitor first few emails** to ensure reliability
- **Customize email template** in n8n if desired

---

**Need help?** Check `TESTING_GUIDE.md` for detailed instructions!

