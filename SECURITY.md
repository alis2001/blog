# Security Implementation

This document outlines the security measures implemented in the Pahlavi for Iran website.

## Security Features

### 1. Authentication & Authorization
- **Secure Password Storage**: Passwords are hashed using bcrypt with salt rounds
- **Session Management**: Secure session handling with httpOnly cookies
- **Role-Based Access**: Admin and editor roles with different permissions
- **User Approval System**: New users require admin approval before accessing the system

### 2. Rate Limiting
- **Login Protection**: Maximum 5 login attempts per 15 minutes
- **General API**: Maximum 100 requests per 15 minutes
- **Admin Routes**: Protected against brute force attacks

### 3. Input Validation & Sanitization
- **Express Validator**: All inputs are validated and sanitized
- **MongoDB Injection Prevention**: mongo-sanitize prevents NoSQL injection attacks
- **XSS Protection**: HTML content is sanitized using sanitize-html
- **Parameter Pollution Prevention**: HPP middleware prevents HTTP parameter pollution

### 4. Security Headers
- **Helmet.js**: Comprehensive HTTP header security
- **Content Security Policy**: Prevents XSS and injection attacks
- **X-Frame-Options**: Prevents clickjacking (DENY)
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Strict-Transport-Security**: Enforces HTTPS in production

### 5. File Upload Security
- **File Type Validation**: Only image files (JPEG, PNG, GIF, WEBP) allowed
- **File Size Limits**: Maximum 5MB per file
- **Filename Sanitization**: Random cryptographic filenames prevent path traversal
- **MIME Type Verification**: Both extension and MIME type are checked

### 6. Session Security
- **Secure Cookies**: httpOnly, secure, and sameSite flags enabled
- **Session Store**: MongoDB session store in production for scalability
- **Session Expiry**: 24-hour automatic expiration
- **CSRF Protection**: Cookie-based session protection

### 7. Data Protection
- **Environment Variables**: Sensitive data stored in .env file
- **Secret Key Management**: Strong session and JWT secrets required
- **Database Connection**: Authentication required for MongoDB access

### 8. Error Handling
- **Production Mode**: Generic error messages, no stack traces exposed
- **Development Mode**: Detailed errors for debugging
- **Error Logging**: All errors are logged for security monitoring

## Security Best Practices

### For Administrators

1. **Use Strong Passwords**
   - Minimum 8 characters
   - Include uppercase, lowercase, numbers, and special characters
   - Change passwords regularly

2. **Enable HTTPS**
   - Always use HTTPS in production
   - Configure SSL/TLS certificates properly

3. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   ```

4. **Monitor Logs**
   - Check application logs regularly
   - Monitor failed login attempts
   - Review error logs for suspicious activity

5. **Database Security**
   - Use strong MongoDB credentials
   - Enable MongoDB authentication
   - Restrict network access to database

### Environment Variables

Required security-related environment variables:

```env
# Session Security
SESSION_SECRET=<strong-random-string-min-32-chars>

# JWT Security
JWT_SECRET=<strong-random-string-min-32-chars>
JWT_EXPIRE=7d

# Admin Credentials (Change in production!)
ADMIN_EMAIL=admin@yourDomain.com
ADMIN_PASSWORD=<strong-password>

# Production Settings
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com

# MongoDB with Authentication
MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin
```

## Security Checklist for Production

- [ ] Change all default passwords
- [ ] Generate strong SESSION_SECRET and JWT_SECRET
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set NODE_ENV=production
- [ ] Enable MongoDB authentication
- [ ] Configure CORS for specific origins only
- [ ] Set up regular database backups
- [ ] Implement security monitoring
- [ ] Review and update dependencies regularly
- [ ] Set appropriate file permissions (chmod 600 for .env)

## Reporting Security Issues

If you discover a security vulnerability, please email: security@pahlaviforiran.com

Do not create public GitHub issues for security vulnerabilities.

## Security Updates

- Last Security Review: January 2026
- Next Scheduled Review: April 2026

