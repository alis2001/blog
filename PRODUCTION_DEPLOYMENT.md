# Production Deployment Guide
## Domain: pahlaviforiran.com

---

## 🎯 Production Checklist

### 1. Server/Hosting Requirements

**Recommended Options:**

**Option A: VPS (Virtual Private Server) - Recommended**
- DigitalOcean Droplet ($6-12/month)
- Linode ($5-10/month)
- AWS EC2 (t2.micro free tier for 1 year)
- Vultr ($6/month)

**Minimum Requirements:**
- 1GB RAM (2GB recommended)
- 1 CPU core
- 25GB SSD storage
- Ubuntu 20.04/22.04 LTS

**Option B: Platform as a Service (PaaS)**
- Heroku (free tier available, but sleeping)
- Railway.app
- Render.com
- Vercel (frontend only, need separate DB)

---

## 📋 Pre-Deployment Setup

### Step 1: Get a Server

**If using DigitalOcean (Recommended):**

1. Create account: https://www.digitalocean.com
2. Create new Droplet:
   - Choose: Ubuntu 22.04 LTS
   - Plan: Basic ($6/month)
   - Region: Choose closest to your users
   - Authentication: SSH keys (recommended) or password
3. Note your server IP address (e.g., 123.45.67.89)

---

### Step 2: Domain Configuration

**Point your domain to your server:**

1. Go to your domain registrar (where you bought pahlaviforiran.com)
2. Find DNS settings
3. Add these DNS records:

```
Type    Name    Value               TTL
A       @       YOUR_SERVER_IP      3600
A       www     YOUR_SERVER_IP      3600
```

Example:
```
A       @       123.45.67.89        3600
A       www     123.45.67.89        3600
```

**Wait 1-24 hours for DNS propagation**

---

### Step 3: Production MongoDB Database

**Option A: MongoDB Atlas (Recommended - Free tier available)**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster:
   - Choose: Free Shared Cluster
   - Region: Closest to your server
   - Cluster name: pahlavi-production
4. Create database user:
   - Username: pahlaviAdmin
   - Password: Generate strong password (save it!)
5. Whitelist IP addresses:
   - Add your server IP
   - Or allow from anywhere: 0.0.0.0/0 (less secure)
6. Get connection string:
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your actual password

Your connection string will look like:
```
mongodb+srv://pahlaviAdmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/pahlavi-iran?retryWrites=true&w=majority
```

**Option B: Self-hosted MongoDB on your server**
- Install MongoDB on your VPS
- Configure authentication
- Backup regularly

---

### Step 4: SSL Certificate (HTTPS)

**Using Let's Encrypt (Free & Automatic):**

We'll set this up after deploying using Certbot.

---

## 🚀 Deployment Steps

### Step 1: Connect to Your Server

```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Install Required Software

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js (v18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Nginx (web server)
apt install -y nginx

# Install PM2 (process manager)
npm install -g pm2

# Install Git
apt install -y git

# Verify installations
node -v
npm -v
nginx -v
pm2 -v
```

### Step 3: Create Application User

```bash
# Create user
adduser pahlavi
usermod -aG sudo pahlavi

# Switch to new user
su - pahlavi
```

### Step 4: Clone Your Repository

```bash
cd ~
git clone YOUR_REPOSITORY_URL blog
cd blog
```

**If repository is private, set up SSH keys or use HTTPS with token**

### Step 5: Install Dependencies

```bash
npm install --production
```

### Step 6: Create Production Environment File

```bash
nano .env
```

**Add this content (update with YOUR actual values):**

```env
# Environment
NODE_ENV=production
PORT=3000

# MongoDB (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://pahlaviAdmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/pahlavi-iran?retryWrites=true&w=majority

# Security (GENERATE NEW RANDOM STRINGS!)
JWT_SECRET=GENERATE_RANDOM_32_CHAR_STRING_HERE
SESSION_SECRET=GENERATE_RANDOM_32_CHAR_STRING_HERE

# Admin Credentials
ADMIN_EMAIL=admin@pahlaviforiran.com
ADMIN_PASSWORD=STRONG_PASSWORD_HERE

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=pahlaviforiran@gmail.com
EMAIL_PASSWORD=jjhxwybvtfcpmbaw
EMAIL_FROM="Pahlavi for Iran <pahlaviforiran@gmail.com>"

# Site URL (IMPORTANT!)
SITE_URL=https://pahlaviforiran.com

# Production Settings
ALLOWED_ORIGINS=https://pahlaviforiran.com,https://www.pahlaviforiran.com
```

**Generate random secrets:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save and exit (Ctrl+X, Y, Enter)

### Step 7: Set Up Database (First Time Only)

```bash
# Create admin user
npm run seed

# Or manually
node src/scripts/setupMainAdmin.js
```

### Step 8: Start Application with PM2

```bash
# Start app
pm2 start server.js --name pahlavi-blog

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Copy and run the command it outputs

# Check status
pm2 status
pm2 logs pahlavi-blog
```

### Step 9: Configure Nginx as Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/pahlaviforiran.com
```

**Add this configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name pahlaviforiran.com www.pahlaviforiran.com;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Proxy to Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|webp)$ {
        proxy_pass http://localhost:3000;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Save and exit.

**Enable the site:**

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/pahlaviforiran.com /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 10: Install SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d pahlaviforiran.com -d www.pahlaviforiran.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)

# Test auto-renewal
sudo certbot renew --dry-run
```

**Certbot will automatically:**
- Get SSL certificate from Let's Encrypt
- Configure Nginx for HTTPS
- Set up auto-renewal (certificates expire every 90 days)

### Step 11: Configure Firewall

```bash
# Enable UFW firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

## 🔒 Security Hardening

### 1. Secure MongoDB

If using Atlas:
- ✅ Already secured
- ✅ Enable IP whitelist
- ✅ Use strong passwords

### 2. Secure Environment Variables

```bash
# Set proper permissions
chmod 600 .env
```

### 3. Keep System Updated

```bash
# Set up automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 4. Set Up Backups

**Database Backup (MongoDB Atlas):**
- Atlas provides automatic backups
- Download backups regularly

**Application Backup:**
```bash
# Create backup script
nano ~/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cd ~/blog
tar -czf $BACKUP_DIR/blog_$DATE.tar.gz --exclude=node_modules .

# Keep only last 7 days
find $BACKUP_DIR -name "blog_*.tar.gz" -mtime +7 -delete
```

```bash
chmod +x ~/backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * ~/backup.sh
```

---

## 📊 Monitoring & Logs

### View Application Logs

```bash
# Real-time logs
pm2 logs pahlavi-blog

# Last 100 lines
pm2 logs pahlavi-blog --lines 100

# Error logs only
pm2 logs pahlavi-blog --err
```

### View Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

### Monitor Application

```bash
# PM2 monitoring
pm2 monit

# System resources
htop
```

---

## 🔄 Deployment Updates

### How to Deploy Code Changes

```bash
# SSH to server
ssh pahlavi@YOUR_SERVER_IP

# Go to project directory
cd ~/blog

# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install --production

# Restart application
pm2 restart pahlavi-blog

# Check status
pm2 status
pm2 logs pahlavi-blog --lines 50
```

### Zero-Downtime Deployments

```bash
# Reload instead of restart
pm2 reload pahlavi-blog
```

---

## ✅ Post-Deployment Checklist

- [ ] DNS properly configured (www and non-www)
- [ ] SSL certificate installed (HTTPS working)
- [ ] Application starts without errors
- [ ] Can access https://pahlaviforiran.com
- [ ] Admin login works
- [ ] Database connection working
- [ ] Email sending works (test subscription)
- [ ] Images/uploads working
- [ ] All pages load correctly
- [ ] Contact form works
- [ ] Newsletter subscription works
- [ ] News notifications send
- [ ] Mobile responsive
- [ ] Fast loading times

---

## 🧪 Testing

### 1. Test Website

```bash
# From your local machine
curl -I https://pahlaviforiran.com
```

Should return: `HTTP/2 200`

### 2. Test SSL

Visit: https://www.ssllabs.com/ssltest/analyze.html?d=pahlaviforiran.com

Should get A or A+ rating

### 3. Test Speed

Visit: https://pagespeed.web.dev/

Test your site and optimize based on results

---

## 🆘 Troubleshooting

### Application Not Starting

```bash
# Check PM2 logs
pm2 logs pahlavi-blog --err

# Check environment variables
pm2 env pahlavi-blog

# Restart
pm2 restart pahlavi-blog
```

### 502 Bad Gateway Error

```bash
# Check if app is running
pm2 status

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart pahlavi-blog
sudo systemctl restart nginx
```

### Domain Not Resolving

```bash
# Check DNS propagation
dig pahlaviforiran.com
nslookup pahlaviforiran.com

# Wait up to 24 hours for full propagation
```

### SSL Certificate Issues

```bash
# Renew certificate manually
sudo certbot renew

# Check certificate
sudo certbot certificates
```

---

## 💰 Estimated Costs

- **Server (DigitalOcean)**: $6-12/month
- **Domain (already owned)**: $0
- **MongoDB Atlas**: Free tier (up to 512MB)
- **SSL Certificate**: Free (Let's Encrypt)
- **Email (Gmail)**: Free

**Total: ~$6-12/month**

---

## 📞 Support Resources

- DigitalOcean Tutorials: https://www.digitalocean.com/community/tutorials
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Let's Encrypt: https://letsencrypt.org/
- PM2 Documentation: https://pm2.keymetrics.io/

---

## 🎉 You're Ready for Production!

Follow these steps carefully and your application will be live at:
**https://pahlaviforiran.com**

Good luck! 🚀
