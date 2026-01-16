# Production Quick Start Guide
## pahlaviforiran.com

---

## 📝 What You Need

### 1. Server
✅ **Get a VPS Server**
- **Recommended**: DigitalOcean ($6/month)
- **Specs**: 1GB RAM, Ubuntu 22.04
- Sign up: https://www.digitalocean.com

### 2. MongoDB Database
✅ **Use MongoDB Atlas (Free)**
- Sign up: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Save connection string

### 3. Domain Setup
✅ **Point Domain to Server**
- Go to your domain registrar
- Add A records pointing to your server IP:
  ```
  A    @      YOUR_SERVER_IP
  A    www    YOUR_SERVER_IP
  ```

---

## 🚀 5-Step Quick Deployment

### Step 1: Set Up Server (5 minutes)
```bash
# SSH to server
ssh root@YOUR_SERVER_IP

# Install Node.js & dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs nginx git
npm install -g pm2
```

### Step 2: Deploy Application (3 minutes)
```bash
# Clone your code
git clone YOUR_REPO_URL blog
cd blog

# Install dependencies
npm install --production

# Create .env file
nano .env
```

**Important .env settings:**
```env
NODE_ENV=production
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
SITE_URL=https://pahlaviforiran.com
EMAIL_USER=pahlaviforiran@gmail.com
EMAIL_PASSWORD=jjhxwybvtfcpmbaw
```

### Step 3: Start Application (1 minute)
```bash
# Start with PM2
pm2 start server.js --name blog
pm2 startup
pm2 save
```

### Step 4: Configure Nginx (2 minutes)
```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/pahlaviforiran.com
```

**Paste this:**
```nginx
server {
    listen 80;
    server_name pahlaviforiran.com www.pahlaviforiran.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Enable and restart:**
```bash
sudo ln -s /etc/nginx/sites-available/pahlaviforiran.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Install SSL (2 minutes)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d pahlaviforiran.com -d www.pahlaviforiran.com
```

**Done! Your site is live at https://pahlaviforiran.com**

---

## ⚡ Quick Commands Reference

### Deploy Updates
```bash
cd ~/blog
git pull
npm install --production
pm2 restart blog
```

### View Logs
```bash
pm2 logs blog
sudo tail -f /var/log/nginx/error.log
```

### Check Status
```bash
pm2 status
sudo systemctl status nginx
```

### Restart Services
```bash
pm2 restart blog
sudo systemctl restart nginx
```

---

## 🎯 Critical Settings to Update

Before going live, update these in `.env`:

1. ✅ `SITE_URL` → `https://pahlaviforiran.com`
2. ✅ `MONGODB_URI` → Your MongoDB Atlas connection
3. ✅ `JWT_SECRET` → Generate new random string
4. ✅ `SESSION_SECRET` → Generate new random string
5. ✅ `ADMIN_PASSWORD` → Change from default

**Generate secrets:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📋 Post-Launch Checklist

- [ ] Website loads at https://pahlaviforiran.com
- [ ] SSL certificate shows (padlock in browser)
- [ ] Admin login works
- [ ] Newsletter subscription works
- [ ] Email notifications send
- [ ] All images load
- [ ] Mobile site works

---

## 🆘 Common Issues

**502 Bad Gateway?**
```bash
pm2 restart blog
sudo systemctl restart nginx
```

**SSL not working?**
- Wait 24 hours for DNS propagation
- Check A records point to correct IP

**Can't connect to MongoDB?**
- Verify connection string in .env
- Check IP whitelist in MongoDB Atlas

---

## 💰 Monthly Costs

- Server: $6-12
- MongoDB: Free
- SSL: Free
- Domain: Already owned

**Total: ~$6-12/month**

---

See **PRODUCTION_DEPLOYMENT.md** for detailed instructions!
