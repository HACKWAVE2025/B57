# Complete n8n Integration Guide

## Quick Start

### 1. Workflow Setup (n8n)

1. **Import the workflow**:
   - Go to https://akshayjuluri.app.n8n.cloud
   - Import `weekly-progress-email-with-webhook.json`
   - OR update your existing workflow at `qhUVlmQv0SFYAMrz`

2. **Configure email (SMTP)**:
   - Click "Send Email" node → Credentials → Create SMTP credential
   - Enter your email provider settings

3. **Activate the workflow**:
   - Toggle "Active" switch ON
   - Webhook URL: `https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz`

### 2. Application Setup

**Add to your main App component:**

```typescript
import { useWeeklyProgressEmail } from './hooks/useWeeklyProgressEmail';

function App() {
  // Automatically sends weekly email on Mondays
  useWeeklyProgressEmail();
  
  // ... rest of your app code
}
```

**That's it!** The integration is now complete.

## How It Works

```
┌─────────────────┐
│   Your App      │
│  (Firestore)    │
└────────┬────────┘
         │
         │ 1. Collects user data
         │    (tasks, streaks, interviews)
         │
         ▼
┌─────────────────┐
│ n8nIntegration  │
│    Service      │
└────────┬────────┘
         │
         │ 2. Sends POST request
         │    with user progress data
         │
         ▼
┌─────────────────┐
│  n8n Webhook    │
│  (qhUVlmQv0...) │
└────────┬────────┘
         │
         │ 3. Processes data
         │    Generates HTML email
         │
         ▼
┌─────────────────┐
│  Email Server   │
│     (SMTP)      │
└────────┬────────┘
         │
         │ 4. Sends email
         │
         ▼
┌─────────────────┐
│   User Email    │
│     Inbox       │
└─────────────────┘
```

## Data Flow

### Step 1: Data Collection
The `n8nIntegrationService` collects:
- ✅ User info (email, username)
- ✅ Week information (week number, dates)
- ✅ Task statistics (total, completed, pending, this week)
- ✅ Streak data (current streak, longest streak)
- ✅ Interview analytics (total, average score, trends)
- ✅ Teams and achievements

### Step 2: Data Transmission
- Service sends POST request to n8n webhook
- URL: `https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz`
- Payload: `{ user: {...all data...}, timestamp: "..." }`

### Step 3: Email Generation
- n8n receives webhook data
- Processes and formats data
- Generates beautiful HTML email
- Includes personalized stats and motivation

### Step 4: Email Delivery
- n8n sends email via SMTP
- User receives weekly progress report

## Manual Testing

### Test the Integration

```typescript
import { n8nIntegrationService } from './utils/n8nIntegrationService';
import { realTimeAuth } from './utils/realTimeAuth';

// Test the webhook
const user = realTimeAuth.getCurrentUser();
if (user) {
  const success = await n8nIntegrationService.testWebhook(user.id);
  console.log(success ? '✅ Success!' : '❌ Failed');
}
```

### Test via cURL

```bash
curl -X POST https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz \
  -H "Content-Type: application/json" \
  -d '{
    "user": {
      "userId": "test-123",
      "email": "your-email@example.com",
      "username": "Test User",
      "weekNumber": 15,
      "currentStreak": 7,
      "completedTasksThisWeek": 5
    }
  }'
```

## Automatic Weekly Emails

The `useWeeklyProgressEmail` hook:
- ✅ Checks if today is Monday
- ✅ Checks if email already sent this week (prevents duplicates)
- ✅ Collects all user progress data
- ✅ Sends to n8n webhook
- ✅ Marks as sent in localStorage

**Runs automatically** when:
- User opens the app on Monday
- Checks every hour on Mondays (until sent)

## Manual Trigger

You can also trigger emails manually:

```typescript
import { n8nIntegrationService } from './utils/n8nIntegrationService';
import { realTimeAuth } from './utils/realTimeAuth';

const sendEmailNow = async () => {
  const user = realTimeAuth.getCurrentUser();
  if (user) {
    await n8nIntegrationService.sendWeeklyProgressToN8N(user.id);
  }
};

// Call from a button click, etc.
sendEmailNow();
```

## Files Created

1. **`src/utils/n8nIntegrationService.ts`**
   - Main service for collecting and sending user data
   - Methods: `collectUserProgressData()`, `sendWeeklyProgressToN8N()`, `testWebhook()`

2. **`src/hooks/useWeeklyProgressEmail.ts`**
   - React hook for automatic weekly emails
   - Handles Monday detection and duplicate prevention

3. **`n8n-workflows/weekly-progress-email-with-webhook.json`**
   - Complete n8n workflow file
   - Ready to import into your n8n instance

4. **`n8n-workflows/README.md`**
   - Complete documentation
   - Setup instructions
   - Troubleshooting guide

## Customization

### Change Email Template
Edit the "Generate Email Content" node in n8n workflow JSON file.

### Add More Data
Modify `n8nIntegrationService.ts` to collect additional data from Firestore.

### Change Schedule
Modify `useWeeklyProgressEmail.ts` to trigger on different days/times.

## Troubleshooting

**Email not sending?**
- Check SMTP credentials in n8n
- Verify webhook is active
- Check browser console for errors
- Test with manual trigger first

**No data in email?**
- Check Firestore has user data
- Verify user is authenticated
- Test data collection with `collectUserProgressData()`

**Webhook not receiving?**
- Ensure workflow is "Active" in n8n
- Check webhook URL is correct
- Test with cURL command above

## Next Steps

1. ✅ Import workflow to n8n
2. ✅ Configure SMTP email
3. ✅ Add hook to App component
4. ✅ Test with manual trigger
5. ✅ Wait for Monday (or trigger manually)

**You're all set!** The integration is complete and ready to send weekly progress emails.

