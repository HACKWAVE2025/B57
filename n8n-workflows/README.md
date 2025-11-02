# Weekly Progress Email - n8n Workflow Integration

This n8n workflow integrates with your Study App to automatically send detailed weekly progress emails to users.

## Features

- **Webhook Integration**: Receives user data from your application via webhook
- **Personalized Emails**: Sends beautifully formatted HTML emails with:
  - User-specific progress data (tasks, streaks, interviews)
  - Current week number and year progress
  - Week start and end dates
  - Visual progress bars
  - Task statistics and completion rates
  - Interview performance analytics
  - Achievement highlights
  - Personalized motivation messages
- **Automatic Weekly Trigger**: App automatically sends data on Mondays
- **Manual Trigger**: Can be manually triggered anytime

## Setup Instructions

### 1. Import the Webhook Workflow

**Option A: Import New Webhook Workflow (Recommended)**
1. Open your n8n instance at https://akshayjuluri.app.n8n.cloud
2. Click on "Workflows" → "Import from File"
3. Select the `weekly-progress-email-with-webhook.json` file
4. The workflow will be imported with all nodes

**Option B: Update Existing Workflow**
If you already have the workflow at `https://akshayjuluri.app.n8n.cloud/workflow/qhUVlmQv0SFYAMrz`:
1. Open the existing workflow
2. Replace the first node (Schedule Trigger) with a Webhook node
3. Configure the webhook path as `qhUVlmQv0SFYAMrz`
4. Copy the node configurations from `weekly-progress-email-with-webhook.json`

### 2. Configure Webhook Settings

1. Open the "Webhook" node (first node)
2. Ensure the path is set to: `qhUVlmQv0SFYAMrz`
3. Set HTTP method to: `POST`
4. Response mode: `Response Node`
5. Copy the webhook URL - it should be: `https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz`
6. Activate the workflow to make the webhook live

### 3. Configure Email Settings

#### Option A: SMTP (Recommended)

1. Click on the "Send Email" node
2. Click on "Credentials" → "Create New Credential"
3. Select "SMTP" and fill in:
   - **Host**: Your SMTP server (e.g., `smtp.gmail.com`, `smtp.outlook.com`)
   - **Port**: Usually 587 for TLS or 465 for SSL
   - **User**: Your email address
   - **Password**: Your email password or app-specific password
   - **Secure**: Enable TLS/SSL as required

#### Option B: Using Other Email Services

You can replace the "Send Email" node with:
- **Gmail** node (if using Gmail)
- **Mailgun** node (if using Mailgun)
- **SendGrid** node (if using SendGrid)
- Or any other email service node in n8n

### 4. Configure Email Recipient

The email recipient is automatically set from the webhook data (`user.email`), so no manual configuration needed. However, you can customize:

1. Open the "Set Email Config" node
2. The `emailRecipient` is automatically set from `={{ $json.email }}`
3. You can customize:
   - `senderName`: The name shown as sender (currently "Weekly Progress System")
   - `emailSubject`: Already customized as `{{ username }}'s Weekly Progress Report - Week {{ weekNumber }}`

### 5. Activate the Workflow

1. Click the "Active" toggle in the top right corner of n8n
2. The workflow is now ready to receive webhook requests from your application
3. Test the webhook by using the test button or sending a POST request with sample data

## Application Integration

### 1. Use the Integration Service

The integration is already set up in your app. The service is located at:
- `src/utils/n8nIntegrationService.ts` - Main service for collecting and sending data
- `src/hooks/useWeeklyProgressEmail.ts` - React hook for automatic weekly emails

### 2. Automatic Weekly Emails

Add the hook to your main App component:

```typescript
import { useWeeklyProgressEmail } from './hooks/useWeeklyProgressEmail';

function App() {
  // This automatically checks and sends emails on Mondays
  useWeeklyProgressEmail();
  
  // ... rest of your app
}
```

### 3. Manual Trigger

You can manually trigger the email from anywhere in your app:

```typescript
import { n8nIntegrationService } from './utils/n8nIntegrationService';
import { realTimeAuth } from './utils/realTimeAuth';

// Send email now
const user = realTimeAuth.getCurrentUser();
if (user) {
  const success = await n8nIntegrationService.sendWeeklyProgressToN8N(user.id);
  if (success) {
    console.log('Email sent successfully!');
  }
}
```

### 4. Test the Integration

Test the webhook connection:

```typescript
import { n8nIntegrationService } from './utils/n8nIntegrationService';
import { realTimeAuth } from './utils/realTimeAuth';

const user = realTimeAuth.getCurrentUser();
if (user) {
  const success = await n8nIntegrationService.testWebhook(user.id);
  console.log('Test result:', success);
}
```

## Workflow Structure

```
Webhook (Receives user data from app)
    ↓
Process Webhook Data (Extracts and formats data)
    ↓
Set Email Config (Sets recipient, subject, sender)
    ↓
Generate Email Content (Creates personalized HTML email)
    ↓
Send Email (Sends via SMTP)
    ↓
Respond to Webhook (Returns success confirmation)
```

## Data Flow

### What Data is Sent to n8n?

The application automatically collects and sends:

1. **User Information**
   - User ID, email, username

2. **Week Information**
   - Current week number
   - Week start/end dates
   - Year progress percentage

3. **Task Statistics**
   - Total tasks, completed, pending
   - Tasks this week
   - High priority tasks
   - Completion rates

4. **Streak Data**
   - Current streak, longest streak
   - Tasks completed today
   - Total tasks completed
   - Weekly goal progress

5. **Interview Analytics**
   - Total interviews
   - Interviews this week
   - Average score
   - Recent scores
   - Improvement trend

6. **Teams & Achievements**
   - Team count
   - Achievements unlocked
   - Recent achievements

## Customization

### Modify Email Content

Edit the "Generate Email Content" node to:
- Change the email template design and styling
- Add custom sections with additional data
- Modify motivational messages
- Add more statistics or charts

### Add External Data

You can add nodes between "Process Webhook Data" and "Set Email Config" to:
- Fetch additional data from external APIs
- Query databases for historical comparisons
- Get weather, quotes, or other contextual information
- Pull in calendar events or reminders

### Add Schedule Trigger (Optional)

If you want the workflow to also run on a schedule (not just when called by the app):
1. Add a "Schedule Trigger" node at the beginning
2. Connect it to a "HTTP Request" node that calls your app's API
3. Your app API can then trigger the webhook or directly collect and send data

## Testing

### Test in n8n

1. Click "Execute Workflow" button in n8n
2. Use the test button on the Webhook node to simulate a request
3. Or manually add test JSON data:
```json
{
  "user": {
    "userId": "test-user-123",
    "email": "test@example.com",
    "username": "Test User",
    "weekNumber": 15,
    "currentStreak": 7,
    "completedTasksThisWeek": 5,
    "totalTasks": 20,
    "completedTasks": 15,
    "pendingTasks": 5,
    "totalInterviews": 10,
    "averageScore": 85
  }
}
```
4. Check each node's output to ensure data flows correctly
5. Verify the email is sent correctly

### Test from Application

1. Add a test button in your app:
```typescript
const handleTestEmail = async () => {
  const user = realTimeAuth.getCurrentUser();
  if (user) {
    const success = await n8nIntegrationService.testWebhook(user.id);
    alert(success ? 'Email sent successfully!' : 'Failed to send email');
  }
};
```
2. Check your email inbox for the test email
3. Verify all data is displayed correctly

## Troubleshooting

### Email Not Sending
- **Check SMTP credentials**: Verify your email provider settings in the "Send Email" node
- **Verify email address**: Ensure the user's email is valid in your database
- **Check spam folder**: The email might be filtered as spam
- **Test webhook manually**: Use the n8n test feature or curl:
```bash
curl -X POST https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz \
  -H "Content-Type: application/json" \
  -d '{"user":{"email":"test@example.com","username":"Test","weekNumber":1}}'
```

### Webhook Not Receiving Data
- **Verify workflow is active**: Check the "Active" toggle in n8n
- **Check webhook URL**: Ensure it matches `https://akshayjuluri.app.n8n.cloud/webhook/qhUVlmQv0SFYAMrz`
- **Check browser console**: Look for errors when `sendWeeklyProgressToN8N` is called
- **Verify user authentication**: Ensure user is logged in when triggering
- **Check CORS**: If testing from browser, ensure n8n allows requests from your domain

### Data Not Appearing in Email
- **Check webhook data**: Inspect the "Process Webhook Data" node output in n8n
- **Verify data collection**: Ensure your Firestore has the expected data structure
- **Check user permissions**: Verify the user has access to their own data
- **Test data collection**: Use `collectUserProgressData` directly to see what's collected

### Weekly Email Not Sending Automatically
- **Check hook is added**: Ensure `useWeeklyProgressEmail()` is called in your App component
- **Verify it's Monday**: The hook only sends on Mondays
- **Check localStorage**: The hook uses localStorage to prevent duplicate sends
- **Manual trigger**: Try manually triggering to test the integration

## Support

For issues or questions:
- Check n8n documentation: https://docs.n8n.io
- Review workflow node configurations
- Test individual nodes to isolate issues
