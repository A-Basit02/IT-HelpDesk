# Ticket Scheduler - Stale Tickets Notification System

## Overview
The Ticket Scheduler is an automated system that monitors tickets in the IT Help Desk application and notifies administrators when tickets have been open or in progress for 3 or more days **without any updates**.

## Features

### 🕐 Automated Daily Check
- Runs automatically every day at 9:00 AM (Pakistan Time)
- **Testing Mode**: Currently set to run every 30 minutes for testing purposes
- Checks for tickets with status 'open' or 'in progress' for 3+ days
- Sends email notifications to all admin users

### 📧 Email Notifications
- Beautiful HTML email template with ticket details
- Includes ticket number, creator name, employee ID, status, and days open
- Provides action items for admins to follow up

### 🔧 Manual Check
- Admin can manually trigger stale tickets check from dashboard
- Useful for testing and immediate notifications
- Accessible via "Check Stale Tickets" button in admin dashboard

## How It Works

### 1. Database Query
The system queries the database for tickets that meet the criteria:
```sql
SELECT 
  t.ticketNumber,
  t.name,
  t.employeeID,
  t.status,
  t.problemStatement,
  t.createdAt,
  t.updatedAt,
  t.problem_dateOccurred,
  DATEDIFF(day, t.updatedAt, GETDATE()) as daysSinceLastUpdate
FROM Tickets t
WHERE t.status IN ('open', 'in progress')
AND DATEDIFF(day, t.updatedAt, GETDATE()) >= 3
ORDER BY t.updatedAt ASC
```

### 2. Email Template
Creates a professional HTML email with:
- Alert header with ticket count
- Detailed table of stale tickets
- Action items for admins
- Professional styling and formatting

### 3. Admin Notification
- Fetches all admin email addresses from database
- Sends individual emails to each admin
- Includes error handling for failed email sends

## Configuration

### Cron Schedule
**Testing Mode (Current):** Runs every 30 minutes:
```javascript
cron.schedule('*/30 * * * *', async () => {
  // Check and notify
}, {
  scheduled: true,
  timezone: "Asia/Karachi"
});
```

**Production Mode:** Runs daily at 9:00 AM Pakistan Time:
```javascript
cron.schedule('0 9 * * *', async () => {
  // Check and notify
}, {
  scheduled: true,
  timezone: "Asia/Karachi"
});
```

### Timezone
Currently set to Pakistan Time (Asia/Karachi). To change:
1. Update the timezone in `server/utils/ticketScheduler.js`
2. Restart the server

### Email Settings
Uses the existing email configuration from `server/utils/emailService.js`

## API Endpoints

### Manual Check Endpoint
```
POST /api/tickets/check-stale-tickets
```
- Requires authentication
- Triggers immediate stale tickets check
- Returns success/error message

## Files Modified/Created

### New Files
- `server/utils/ticketScheduler.js` - Main scheduler logic
- `server/TICKET_SCHEDULER.md` - This documentation

### Modified Files
- `server/index.js` - Added scheduler initialization
- `server/controllers/ticketController.js` - Added manual check controller
- `server/routes/ticketRoutes.js` - Added manual check route
- `client/src/pages/admin/Dashboard.jsx` - Added manual check button

## Dependencies Added
- `node-cron` - For scheduling tasks

## Testing

### Manual Testing
1. Login as admin
2. Go to admin dashboard
3. Click "Check Stale Tickets" button
4. Check server logs for results
5. Check admin email for notification

### Automated Testing
The scheduler runs automatically every day at 9:00 AM. To test:
1. Create test tickets with 'open' or 'in progress' status
2. Wait for 3 days or manually adjust dates in database
3. Trigger manual check or wait for scheduled run

## Troubleshooting

### Common Issues

1. **Scheduler not running**
   - Check server logs for initialization message
   - Verify timezone settings
   - Ensure server is running continuously

2. **Emails not sending**
   - Check email configuration in `emailService.js`
   - Verify admin users exist in database
   - Check server logs for email errors

3. **No stale tickets found**
   - Verify tickets exist with 'open' or 'in progress' status
   - Check ticket creation dates
   - Ensure database connection is working

### Log Messages
The system provides detailed logging:
- `🕐 Initializing ticket scheduler...`
- `✅ Ticket scheduler initialized`
- `🔍 Checking for stale tickets...`
- `⚠️ Found X stale ticket(s)`
- `✅ Stale tickets notification sent to [email]`

## Future Enhancements

1. **Configurable Thresholds**
   - Allow admins to set custom day thresholds
   - Different thresholds for different ticket types

2. **Escalation System**
   - Multiple notification levels
   - Escalate to higher management after certain days

3. **Dashboard Integration**
   - Show stale tickets count on dashboard
   - Real-time notifications

4. **Custom Schedules**
   - Allow different schedules for different ticket types
   - Weekend/holiday exclusions

## Security Considerations

- Manual check endpoint requires authentication
- Only admin users can trigger manual checks
- Email notifications only sent to admin users
- Database queries use parameterized statements 