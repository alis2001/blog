# Email Newsletter Setup Guide

## Overview
The newsletter system sends automated emails to subscribers using Gmail SMTP. Two types of emails are sent:
1. **Welcome Email** - Sent immediately when someone subscribes
2. **News Notifications** - Sent automatically when a news article is published

---

## Gmail Configuration

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App-Specific Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter a name like: "Pahlavi for Iran Newsletter"
5. Click **Generate**
6. Copy the 16-character password (you won't see it again!)

---

## Environment Configuration

### Update your `.env` file with the following:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=pahlaviforiran@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Your 16-character app password
EMAIL_FROM="Pahlavi for Iran <pahlaviforiran@gmail.com>"

# Site URL (used in email links)
SITE_URL=http://localhost:3001  # Change to your domain in production
```

**Important Notes:**
- Use the **app-specific password**, NOT your regular Gmail password
- Remove any spaces from the app password when entering it
- In production, change `SITE_URL` to your actual domain (e.g., https://yourdomain.com)

---

## Email Features

### 1. Welcome Email
**Triggered when:** A user subscribes to the newsletter

**Contains:**
- Welcome message
- Overview of what they'll receive
- Link to visit the website
- Unsubscribe information

### 2. News Notification Email
**Triggered when:** 
- A new article is created with status "published" in the "news" category
- OR an existing article is changed to "published" status in the "news" category

**Contains:**
- Article featured image (if available)
- Article title
- Category and publication date
- Source information (if applicable)
- Article excerpt
- Direct link to read the full article on the website

### Batch Processing
- Emails are sent in batches of 50 to avoid overwhelming the server
- 1-second delay between batches
- Errors are logged but don't stop the process

---

## Testing the Email System

### Test Welcome Email
1. Go to your website homepage
2. Scroll to the "Stay Updated on Iranian Revolution 2026" section
3. Enter a test email address
4. Click "Subscribe Free"
5. Check the email inbox for the welcome message

### Test News Notification
1. Log in to the admin panel
2. Create a new article:
   - Set **Category** to "News"
   - Set **Status** to "Published"
   - Add title, content, and excerpt
3. Click "Create Article"
4. All active subscribers should receive an email notification

**OR** Update an existing draft article:
1. Edit a draft article
2. Change **Category** to "News"
3. Change **Status** to "Published"
4. Click "Update Article"
5. All active subscribers will be notified

---

## Monitoring

### Console Logs
The system logs email activities to the console:
- `Welcome email sent to: email@example.com` - Welcome email sent successfully
- `Sending news notification to X subscribers for: Article Title` - News notifications initiated
- `News notification sent: X successful, Y failed` - Batch email results
- Error messages if emails fail to send

### Checking Subscribers
You can view all subscribers in the MongoDB database:

```javascript
// In MongoDB shell or Compass
db.subscriptions.find({ isActive: true })
```

---

## Troubleshooting

### "Failed to send welcome email" Error
**Causes:**
- Incorrect Gmail credentials
- App-specific password not generated
- Gmail account blocked suspicious activity

**Solutions:**
1. Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
2. Generate a new app-specific password
3. Check Gmail security settings
4. Try logging into Gmail from the server's IP address to whitelist it

### Emails Not Being Sent for Published Articles
**Check:**
1. Is the category set to "news"?
2. Is the status set to "published"?
3. Are there active subscribers? Check: `db.subscriptions.find({ isActive: true }).count()`
4. Check server console for error messages

### Emails Going to Spam
**Solutions:**
1. Add SPF and DKIM records to your domain (if using custom domain)
2. Warm up your Gmail account by starting with small batches
3. Encourage subscribers to add your email to their contacts
4. Ensure email content follows best practices (avoid spam trigger words)

### Gmail Daily Sending Limits
**Free Gmail accounts:**
- Maximum 500 emails per day
- Maximum 100 recipients per email

**Solutions:**
- Use Google Workspace (higher limits)
- Implement email queuing for large subscriber lists
- Consider using dedicated email service (SendGrid, Mailgun, etc.)

---

## Production Recommendations

### 1. Use Environment Variables
Never commit `.env` file with real credentials to version control.

### 2. Use Professional Email Service
For production with many subscribers, consider:
- **SendGrid** - 100 emails/day free, then paid plans
- **Mailgun** - 5,000 emails/month free
- **Amazon SES** - $0.10 per 1,000 emails
- **Google Workspace** - Higher sending limits

### 3. Update Site URL
Change `SITE_URL` in production `.env`:
```env
SITE_URL=https://yourdomain.com
```

### 4. Implement Unsubscribe Feature
Currently, users must contact you to unsubscribe. Consider adding:
- Unsubscribe link in email footer
- Unsubscribe page on website
- One-click unsubscribe functionality

### 5. Email Template Improvements
Consider adding:
- Social media links
- Company logo
- Mobile responsive design testing
- A/B testing for better engagement

---

## Security Notes

1. **Never share your app-specific password**
2. **Regenerate password if compromised**
3. **Monitor Gmail account for suspicious activity**
4. **Use HTTPS in production** for secure form submissions
5. **Validate all email addresses** before storing (already implemented)
6. **Rate limit subscription form** to prevent abuse (recommended)

---

## Support

For issues related to:
- **Email delivery:** Check Gmail account settings
- **System functionality:** Check server logs
- **Code errors:** Check console output and error logs

---

**Last Updated:** January 2026
