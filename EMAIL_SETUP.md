# Email Setup Guide for IT Help Desk App

## Prerequisites
- Gmail account
- Gmail App Password (not your regular password)

## Setup Instructions

### 1. Enable 2-Factor Authentication on Gmail
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification

### 2. Generate App Password
1. Go to Google Account settings
2. Navigate to Security
3. Under "2-Step Verification", click on "App passwords"
4. Generate a new app password for "Mail"
5. Copy the 16-character password

### 3. Environment Variables
Add the following variables to your `.env` file in the server directory:

```env
# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_app_password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### 4. Email Notifications
The system will now send email notifications for:

1. **New Ticket Creation**: Admins receive notification when a user creates a new ticket
2. **Ticket Status Updates**: Users receive notification when admin changes ticket status
3. **Ticket Edits**: Admins receive notification when users edit their tickets

### 5. Email Templates
The system includes beautiful HTML email templates with:
- Professional styling
- Ticket details in organized tables
- User information
- Direct links to dashboard
- Responsive design

### 6. Testing
To test email functionality:
1. Create a new ticket as a user
2. Check admin email for notification
3. Update ticket status as admin
4. Check user email for status update notification

### Troubleshooting
- Ensure Gmail app password is correct
- Check that 2FA is enabled on Gmail
- Verify environment variables are set correctly
- Check server logs for email errors

### Security Notes
- Never commit your `.env` file to version control
- Use app passwords, not your regular Gmail password
- Consider using environment-specific email accounts for production 