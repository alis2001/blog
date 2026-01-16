# Docker Quick Start Guide
## Test Locally & Deploy to AWS EC2

---

## 🐳 Test Locally First (5 minutes)

### Prerequisites
- Docker installed on your computer
- Docker Compose installed

### Quick Test

```bash
# 1. Create .env.production file
cp env.example .env.production
# Edit .env.production with your MongoDB Atlas connection string

# 2. Build and start
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up

# 3. Test in browser
# Open: http://localhost:3000

# 4. Stop
# Press Ctrl+C
docker-compose -f docker-compose.production.yml down
```

---

## 🚀 Deploy to AWS EC2 (30 minutes)

### Phase 1: AWS Setup (10 min)

1. **Launch EC2 Instance**
   - Login to AWS Console
   - EC2 → Launch Instance
   - Choose: t3.small (2GB RAM recommended)
   - OS: Amazon Linux 2023
   - Create key pair → Download .pem file
   - Allow ports: 22, 80, 443

2. **Get Elastic IP**
   - EC2 → Elastic IPs
   - Allocate new address
   - Associate with your instance
   - Note the IP address

3. **Configure Domain**
   - Go to your domain registrar
   - Add A records:
     ```
     @    →  YOUR_ELASTIC_IP
     www  →  YOUR_ELASTIC_IP
     ```

### Phase 2: Server Setup (10 min)

```bash
# 1. Connect to server
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@YOUR_ELASTIC_IP

# 2. Install Docker
sudo dnf update -y
sudo dnf install docker git -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Logout and login again
exit
ssh -i your-key.pem ec2-user@YOUR_ELASTIC_IP
```

### Phase 3: Deploy App (10 min)

```bash
# 1. Clone repository
git clone YOUR_REPO_URL blog
cd blog

# 2. Create .env.production
nano .env.production
```

**Paste this (update YOUR values):**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ADMIN_EMAIL=admin@pahlaviforiran.com
ADMIN_PASSWORD=YOUR_STRONG_PASSWORD
EMAIL_USER=pahlaviforiran@gmail.com
EMAIL_PASSWORD=jjhxwybvtfcpmbaw
EMAIL_FROM="Pahlavi for Iran <pahlaviforiran@gmail.com>"
SITE_URL=https://pahlaviforiran.com
```

```bash
# 3. Start containers
docker-compose -f docker-compose.production.yml up -d --build

# 4. Check status
docker ps
docker logs pahlavi-blog
```

### Phase 4: SSL Certificate (5 min)

```bash
# 1. Install Certbot
sudo dnf install certbot -y

# 2. Stop nginx temporarily
docker-compose -f docker-compose.production.yml stop nginx

# 3. Get certificate
sudo certbot certonly --standalone -d pahlaviforiran.com -d www.pahlaviforiran.com

# 4. Copy certificates
mkdir -p ~/blog/nginx/ssl
sudo cp /etc/letsencrypt/live/pahlaviforiran.com/fullchain.pem ~/blog/nginx/ssl/
sudo cp /etc/letsencrypt/live/pahlaviforiran.com/privkey.pem ~/blog/nginx/ssl/
sudo chown -R ec2-user:ec2-user ~/blog/nginx/ssl

# 5. Start everything
docker-compose -f docker-compose.production.yml up -d

# 6. Verify
curl -I https://pahlaviforiran.com
```

---

## ✅ Verification

Visit these URLs:
- ✅ https://pahlaviforiran.com
- ✅ https://pahlaviforiran.com/admin
- ✅ Test newsletter subscription
- ✅ Check welcome email

---

## 🔄 Update Deployment

```bash
# SSH to server
ssh -i your-key.pem ec2-user@YOUR_ELASTIC_IP

# Update code
cd ~/blog
git pull

# Rebuild and restart
docker-compose -f docker-compose.production.yml up -d --build

# Verify
docker ps
docker logs pahlavi-blog
```

---

## 📊 Useful Commands

```bash
# View logs
docker-compose logs -f app

# Restart app
docker-compose -f docker-compose.production.yml restart app

# Stop everything
docker-compose -f docker-compose.production.yml down

# Clean up old images
docker system prune -a

# Check resources
docker stats
df -h
```

---

## 🆘 Quick Fixes

**502 Error?**
```bash
docker-compose -f docker-compose.production.yml restart
```

**Container won't start?**
```bash
docker logs pahlavi-blog
docker logs pahlavi-nginx
```

**Out of memory?**
```bash
# Add swap
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 💰 Cost: ~$15-20/month

- EC2 t3.small: $15/month
- Storage: $3/month
- MongoDB Atlas: FREE
- SSL: FREE

---

See **AWS_EC2_DOCKER_DEPLOYMENT.md** for detailed guide!
