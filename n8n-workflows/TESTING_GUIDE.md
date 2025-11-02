# Testing Guide - n8n Weekly Progress Email

## Quick Test Steps

### Step 1: Set Up n8n Workflow (5 minutes)

1. **Open your n8n instance**
   - Go to: https://akshayjuluri.app.n8n.cloud
   - Login to your account

2. **Import the workflow**
   - Click "Workflows" in the sidebar
   - Click "Import from File" (top right)
   - Select: `n8n-workflows/weekly-progress-email-with-webhook.json`
   - The workflow will be imported

3. **Configure Email (SMTP)**
   - Click on the "Send Email" node
   - Click "Credentials" dropdown → "Create New Credential"
   - Choose "SMTP"
   - Fill in your email provider settings:
     ```
     Host: smtp.gmail.com (or your provider)
     Port: 587 (for TLS) or 465 (for SSL)
     User: your-email@gmail.com
     Password: your-app-password (Gmail users need app password)
     Secure: TLS or SSL
     ```
   - Click "Save"

4. **Activate the workflow**
   - Toggle the "Active" switch (top right) to ON
   - Copy the webhook URL (shown in Webhook node): 
     ```
     https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz
     ```

### Step 2: Test Directly in n8n (2 minutes)

1. **Test the workflow with sample data**
   - Click on the "Webhook" node
   - Click "Listen for Test Event" button
   - This will generate a test URL

2. **Send test data via browser or Postman**
   - Open a new browser tab
   - Go to the test URL generated
   - OR use this curl command in terminal:
   ```bash
   curl -X POST https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz \
     -H "Content-Type: application/json" \
     -d '{
       "user": {
         "userId": "test-user-123",
         "email": "your-email@example.com",
         "username": "Test User",
         "weekNumber": 15,
         "weekStart": "2024-01-15T00:00:00.000Z",
         "weekEnd": "2024-01-21T23:59:59.999Z",
         "year": 2024,
         "progressPercentage": 29,
         "totalTasks": 20,
         "completedTasks": 15,
         "pendingTasks": 5,
         "tasksThisWeek": 8,
         "completedTasksThisWeek": 5,
         "highPriorityTasks": 3,
         "currentStreak": 7,
         "longestStreak": 10,
         "tasksCompletedToday": 2,
         "totalTasksCompleted": 50,
         "weeklyGoal": 7,
         "tasksCompletedThisWeek": 5,
         "totalInterviews": 10,
         "interviewsThisWeek": 2,
         "averageScore": 85,
         "recentInterviewScore": 90,
         "improvementTrend": "improving",
         "teamCount": 2,
         "achievementsUnlocked": 5,
         "recentAchievements": ["Week Warrior", "Task Master"]
       }
     }'
   ```

3. **Check the workflow execution**
   - In n8n, you should see the workflow execute
   - Check each node's output (click on nodes to see data)
   - Verify email was sent by checking your inbox

### Step 3: Test from Your Application (5 minutes)

1. **Add the hook to your App component**
   
   Open `src/App.tsx` and add:

   ```typescript
   import { useWeeklyProgressEmail } from './hooks/useWeeklyProgressEmail';

   function App() {
     // Add this line
     useWeeklyProgressEmail();
     
     // ... rest of your existing code
   }
   ```

2. **Create a test button (optional)**

   Create a test component or add to an existing page:

   ```typescript
   import { useState } from 'react';
   import { n8nIntegrationService } from '../utils/n8nIntegrationService';
   import { realTimeAuth } from '../utils/realTimeAuth';

   function TestEmailButton() {
     const [loading, setLoading] = useState(false);
     const [result, setResult] = useState<string>('');

     const handleTest = async () => {
       const user = realTimeAuth.getCurrentUser();
       if (!user) {
         setResult('❌ User not authenticated');
         return;
       }

       setLoading(true);
       setResult('🔄 Sending test email...');
       
       try {
         const success = await n8nIntegrationService.testWebhook(user.id);
         if (success) {
           setResult('✅ Email sent successfully! Check your inbox.');
         } else {
           setResult('❌ Failed to send email. Check console for errors.');
         }
       } catch (error) {
         setResult(`❌ Error: ${error}`);
       } finally {
         setLoading(false);
       }
     };

     return (
       <div style={{ padding: '20px', textAlign: 'center' }}>
         <button 
           onClick={handleTest}
           disabled={loading}
           style={{
             padding: '10px 20px',
             fontSize: '16px',
             backgroundColor: '#667eea',
             color: 'white',
             border: 'none',
             borderRadius: '5px',
             cursor: loading ? 'not-allowed' : 'pointer'
           }}
         >
           {loading ? 'Sending...' : '📧 Test Weekly Email'}
         </button>
         {result && <p style={{ marginTop: '10px' }}>{result}</p>}
       </div>
     );
   }

   export default TestEmailButton;
   ```

3. **Run your app**
   ```bash
   npm run dev
   ```

4. **Click the test button**
   - Make sure you're logged in
   - Click "Test Weekly Email" button
   - Check your email inbox
   - Check browser console for any errors

### Step 4: Test Automatic Weekly Email (Next Monday)

The `useWeeklyProgressEmail` hook automatically:
- Checks if today is Monday
- Sends email if not already sent this week
- You can force it to send by modifying the hook temporarily

**Force test (for any day):**
Temporarily modify `src/hooks/useWeeklyProgressEmail.ts`:

```typescript
// Change this line:
if (dayOfWeek === 1) {

// To this (to test on any day):
if (true) {
```

## Verification Checklist

✅ **n8n Workflow**
- [ ] Workflow imported successfully
- [ ] Workflow is "Active" (toggle ON)
- [ ] SMTP credentials configured
- [ ] Webhook URL is accessible

✅ **Email Configuration**
- [ ] SMTP settings correct
- [ ] Test email received
- [ ] Email content displays correctly
- [ ] All user data appears in email

✅ **Application Integration**
- [ ] Hook added to App component
- [ ] No console errors
- [ ] User authentication working
- [ ] Data collection working (check console logs)

✅ **Data Flow**
- [ ] Webhook receives data (check n8n execution logs)
- [ ] Email generated correctly
- [ ] Email sent successfully

## Debugging

### Check Webhook is Receiving Data

1. In n8n, click on "Webhook" node
2. Click "Listen for Test Event"
3. Send test data
4. Check the node output - you should see the JSON data

### Check Browser Console

Open browser DevTools (F12) and look for:
- ✅ Success: `"✅ Successfully sent progress data to n8n"`
- ❌ Error: Any red error messages

### Check n8n Execution Logs

1. In n8n, go to "Executions" tab
2. Click on recent execution
3. Check each node:
   - Webhook: Should show incoming data
   - Process Webhook Data: Should show formatted data
   - Set Email Config: Should show email settings
   - Generate Email Content: Should show HTML email
   - Send Email: Should show success
   - Respond to Webhook: Should show response

### Common Issues

**Issue: "Webhook not found"**
- Solution: Make sure workflow is "Active"
- Check webhook path is `qhUVlmQv0SFYAMrz`

**Issue: "Email not sending"**
- Solution: Check SMTP credentials
- Verify email address is correct
- Check spam folder

**Issue: "No data in email"**
- Solution: Check Firestore has user data
- Verify user is authenticated
- Test data collection: `await n8nIntegrationService.collectUserProgressData(userId)`

**Issue: "CORS error"**
- Solution: n8n cloud should handle CORS automatically
- If testing locally, might need to configure CORS in n8n

## Quick Test Script

Create a file `test-n8n.js` in project root:

```javascript
// Quick test script - run with: node test-n8n.js

const testData = {
  user: {
    userId: "test-user-123",
    email: "your-email@example.com", // CHANGE THIS
    username: "Test User",
    weekNumber: 15,
    weekStart: new Date().toISOString(),
    weekEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    year: new Date().getFullYear(),
    progressPercentage: 29,
    totalTasks: 20,
    completedTasks: 15,
    pendingTasks: 5,
    tasksThisWeek: 8,
    completedTasksThisWeek: 5,
    highPriorityTasks: 3,
    currentStreak: 7,
    longestStreak: 10,
    tasksCompletedToday: 2,
    totalTasksCompleted: 50,
    weeklyGoal: 7,
    tasksCompletedThisWeek: 5,
    totalInterviews: 10,
    interviewsThisWeek: 2,
    averageScore: 85,
    recentInterviewScore: 90,
    improvementTrend: "improving",
    teamCount: 2,
    achievementsUnlocked: 5,
    recentAchievements: ["Week Warrior", "Task Master"]
  }
};

fetch('https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ Success!', data);
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
```

Run: `node test-n8n.js` (after changing the email)

## Next Steps After Testing

Once everything works:
1. ✅ Remove test button (if you added one)
2. ✅ Verify automatic weekly email works (on Monday)
3. ✅ Monitor first few weeks to ensure reliability
4. ✅ Customize email template if needed

## Success Indicators

You'll know it's working when:
- ✅ You receive a test email
- ✅ Email contains your actual data (not test data)
- ✅ All statistics are displayed correctly
- ✅ Email is beautifully formatted
- ✅ No errors in console or n8n logs

Good luck! 🚀

