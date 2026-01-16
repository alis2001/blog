# AWS EC2 + Docker Deployment Guide
## pahlaviforiran.com

---

## 🎯 Architecture Overview

```
Internet → Route 53 (DNS) → EC2 Instance
                              ↓
                         Docker Compose
                              ↓
                    ┌─────────┴─────────┐
                    │                   │
                  Nginx            Node.js App
                (Container)       (Container)
                    ↓                   ↓
                SSL/HTTPS         MongoDB Atlas
```

---

## 📋 Prerequisites

- AWS Account
- Domain: pahlaviforiran.com
- MongoDB Atlas account (free tier)
- Basic knowledge of SSH

---

## 🚀 Part 1: Set Up AWS EC2 Instance

### Step 1: Launch EC2 Instance

1. **Login to AWS Console**: https://console.aws.amazon.com

2. **Go to EC2 Dashboard**
   - Services → EC2 → Launch Instance

3. **Configure Instance:**

   **Name:** `pahlavi-blog-production`

   **AMI (Operating System):**
   - Amazon Linux 2023 (recommended)
   - OR Ubuntu Server 22.04 LTS

   **Instance Type:**
   - **Free Tier**: t2.micro (1 vCPU, 1GB RAM)
   - **Recommended**: t3.small (2 vCPU, 2GB RAM) - ~$15/month

   **Key Pair:**
   - Create new key pair
   - Name: `pahlavi-blog-key`
   - Type: RSA
   - Format: .pem (for Mac/Linux) or .ppk (for Windows/PuTTY)
   - **Download and save securely!**

   **Network Settings:**
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere (0.0.0.0/0)
   - Allow HTTPS (port 443) from anywhere (0.0.0.0/0)

   **Storage:**
   - 20 GB gp3 (minimum)
   - 30 GB recommended

4. **Launch Instance**

5. **Note your Public IP**: e.g., `54.123.45.67`

---

### Step 2: Allocate Elastic IP (Important!)

EC2 public IPs change on restart. Get a permanent IP:

1. **EC2 Dashboard → Elastic IPs**
2. **Allocate Elastic IP address**
3. **Associate with your instance**
4. **Note your Elastic IP**: e.g., `54.123.45.67`

---

### Step 3: Configure Domain (Route 53 or External)

**Option A: Using AWS Route 53**

1. **Route 53 → Hosted Zones**
2. **Create hosted zone**: `pahlaviforiran.com`
3. **Create Record Sets:**
   ```
   Type: A
   Name: @
   Value: YOUR_ELASTIC_IP
   TTL: 300

   Type: A
   Name: www
   Value: YOUR_ELASTIC_IP
   TTL: 300
   ```
4. **Update domain nameservers** at your registrar with Route 53 nameservers

**Option B: Using Your Domain Registrar**

1. Go to your domain registrar DNS settings
2. Add A records:
   ```
   Type    Name    Value                   TTL
   A       @       YOUR_ELASTIC_IP         3600
   A       www     YOUR_ELASTIC_IP         3600
   ```

---

## 🐳 Part 2: Install Docker on EC2

### Step 1: Connect to EC2

**On Mac/Linux:**
```bash
# Set permissions
chmod 400 pahlavi-blog-key.pem

# SSH to instance
ssh -i pahlavi-blog-key.pem ec2-user@YOUR_ELASTIC_IP
```

**On Windows (using PuTTY):**
- Use PuTTYgen to convert .pem to .ppk
- Connect using PuTTY with your .ppk key

---

### Step 2: Update System

**For Amazon Linux 2023:**
```bash
sudo dnf update -y
```

**For Ubuntu:**
```bash
sudo apt update && sudo apt upgrade -y
```

---

### Step 3: Install Docker

**For Amazon Linux 2023:**
```bash
# Install Docker
sudo dnf install docker -y

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
exit
# SSH back in
ssh -i pahlavi-blog-key.pem ec2-user@YOUR_ELASTIC_IP
```

**For Ubuntu:**
```bash
# Install Docker
sudo apt install docker.io docker-compose -y

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -a -G docker ubuntu

# Logout and login again
exit
# SSH back in
ssh -i pahlavi-blog-key.pem ubuntu@YOUR_ELASTIC_IP
```

**Verify Installation:**
```bash
docker --version
docker-compose --version
```

---

## 📦 Part 3: Deploy Application

### Step 1: Clone Repository

```bash
# Install Git (if needed)
sudo dnf install git -y  # Amazon Linux
# OR
sudo apt install git -y  # Ubuntu

# Clone your repository
cd ~
git clone YOUR_REPOSITORY_URL blog
cd blog
```

---

### Step 2: Create Production Environment File

```bash
nano .env.production
```

**Add this content:**

```env
# Environment
NODE_ENV=production
PORT=3000

# MongoDB Atlas (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pahlavi-iran?retryWrites=true&w=majority

# Security (GENERATE NEW!)
JWT_SECRET=GENERATE_32_CHAR_RANDOM_STRING
SESSION_SECRET=GENERATE_32_CHAR_RANDOM_STRING

# Admin Credentials
ADMIN_EMAIL=admin@pahlaviforiran.com
ADMIN_PASSWORD=STRONG_SECURE_PASSWORD

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=pahlaviforiran@gmail.com
EMAIL_PASSWORD=jjhxwybvtfcpmbaw
EMAIL_FROM="Pahlavi for Iran <pahlaviforiran@gmail.com>"

# Site URL (CRITICAL!)
SITE_URL=https://pahlaviforiran.com

# Allowed Origins
ALLOWED_ORIGINS=https://pahlaviforiran.com,https://www.pahlaviforiran.com
```

**Generate secure secrets:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Save and exit (Ctrl+X, Y, Enter)

---

### Step 3: Build and Start Docker Containers

```bash
# Build Docker image
docker-compose -f docker-compose.production.yml build

# Start containers
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app
```

**Expected output:**
```
pahlavi-blog    running
pahlavi-nginx   running
```

---

### Step 4: Set Up SSL Certificate (Let's Encrypt)

**Install Certbot:**

```bash
# For Amazon Linux
sudo dnf install certbot python3-certbot-nginx -y

# For Ubuntu
sudo apt install certbot -y
```

**Stop nginx container temporarily:**
```bash
docker-compose -f docker-compose.production.yml stop nginx
```

**Get SSL Certificate:**
```bash
sudo certbot certonly --standalone -d pahlaviforiran.com -d www.pahlaviforiran.com
```

Follow prompts:
- Enter email address
- Agree to terms
- Choose whether to share email

**Certificates will be saved to:** `/etc/letsencrypt/live/pahlaviforiran.com/`

**Copy certificates to nginx directory:**
```bash
mkdir -p ~/blog/nginx/ssl
sudo cp /etc/letsencrypt/live/pahlaviforiran.com/fullchain.pem ~/blog/nginx/ssl/
sudo cp /etc/letsencrypt/live/pahlaviforiran.com/privkey.pem ~/blog/nginx/ssl/
sudo chown -R ec2-user:ec2-user ~/blog/nginx/ssl
```

**Restart containers:**
```bash
docker-compose -f docker-compose.production.yml up -d
```

**Set up auto-renewal:**
```bash
# Create renewal script
cat > ~/renew-cert.sh << 'EOF'
#!/bin/bash
cd ~/blog
docker-compose -f docker-compose.production.yml stop nginx
sudo certbot renew
sudo cp /etc/letsencrypt/live/pahlaviforiran.com/fullchain.pem ~/blog/nginx/ssl/
sudo cp /etc/letsencrypt/live/pahlaviforiran.com/privkey.pem ~/blog/nginx/ssl/
sudo chown -R ec2-user:ec2-user ~/blog/nginx/ssl
docker-compose -f docker-compose.production.yml up -d
EOF

chmod +x ~/renew-cert.sh

# Schedule monthly renewal
(crontab -l 2>/dev/null; echo "0 3 1 * * ~/renew-cert.sh") | crontab -
```

---

## ✅ Part 4: Verify Deployment

### Check Everything is Running

```bash
# Check containers
docker ps

# Check app logs
docker logs pahlavi-blog

# Check nginx logs
docker logs pahlavi-nginx

# Test local connection
curl http://localhost:3000
```

### Test Your Website

1. **Visit:** https://pahlaviforiran.com
2. **Check SSL:** Should show padlock 🔒
3. **Test admin login:** https://pahlaviforiran.com/admin
4. **Test subscription:** Subscribe with test email
5. **Check email:** Verify welcome email arrives

---

## 🔄 Deploying Updates

### Quick Update Process

```bash
# SSH to server
ssh -i pahlavi-blog-key.pem ec2-user@YOUR_ELASTIC_IP

# Go to project directory
cd ~/blog

# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.production.yml up -d --build

# Check logs
docker-compose logs -f app
```

### Zero-Downtime Update (Blue-Green)

```bash
# Build new image
docker-compose -f docker-compose.production.yml build app

# Restart with rolling update
docker-compose -f docker-compose.production.yml up -d --no-deps app

# Verify
docker-compose ps
```

---

## 📊 Monitoring & Maintenance

### View Logs

```bash
# All logs
docker-compose -f docker-compose.production.yml logs -f

# App logs only
docker logs -f pahlavi-blog

# Last 100 lines
docker logs --tail 100 pahlavi-blog
```

### Check Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up unused images
docker system prune -a
```

### Restart Services

```bash
# Restart specific service
docker-compose -f docker-compose.production.yml restart app

# Restart all
docker-compose -f docker-compose.production.yml restart

# Stop all
docker-compose -f docker-compose.production.yml down

# Start all
docker-compose -f docker-compose.production.yml up -d
```

---

## 🔒 Security Best Practices

### 1. Firewall (Security Groups)

In AWS Console → EC2 → Security Groups:

**Inbound Rules:**
```
Type        Protocol    Port    Source
SSH         TCP         22      Your IP only
HTTP        TCP         80      0.0.0.0/0
HTTPS       TCP         443     0.0.0.0/0
```

### 2. Regular Updates

```bash
# Update system monthly
sudo dnf update -y  # Amazon Linux
# OR
sudo apt update && sudo apt upgrade -y  # Ubuntu

# Update Docker images
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml up -d
```

### 3. Backups

**Automated Backup Script:**

```bash
cat > ~/backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Backup application files
cd ~/blog
tar -czf $BACKUP_DIR/blog_$DATE.tar.gz \
  --exclude=node_modules \
  --exclude=.git \
  .

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz public/uploads

# Keep only last 7 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x ~/backup.sh

# Schedule daily backups at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * ~/backup.sh") | crontab -
```

---

## 💰 Cost Estimate

### AWS EC2 Costs

**t2.micro (Free Tier - First 12 months)**
- Instance: FREE
- Storage (20GB): $2/month
- Data transfer: 15GB free
- **Total: ~$2/month**

**t3.small (After free tier / Better performance)**
- Instance: $15/month
- Storage (30GB): $3/month
- Data transfer: 15GB free
- Elastic IP: FREE (if associated)
- **Total: ~$18/month**

### Other Costs
- MongoDB Atlas: FREE (512MB)
- Domain: Already owned
- SSL: FREE (Let's Encrypt)

**Total Monthly: $2-20/month depending on instance type**

---

## 🆘 Troubleshooting

### Containers Won't Start

```bash
# Check logs
docker-compose logs

# Check .env file
cat .env.production

# Rebuild
docker-compose -f docker-compose.production.yml up -d --build
```

### 502 Bad Gateway

```bash
# Check if app container is running
docker ps

# Check app logs
docker logs pahlavi-blog

# Restart services
docker-compose -f docker-compose.production.yml restart
```

### SSL Certificate Issues

```bash
# Check certificate files
ls -la ~/blog/nginx/ssl/

# Renew manually
~/renew-cert.sh
```

### Out of Disk Space

```bash
# Check disk usage
df -h

# Clean Docker
docker system prune -a --volumes

# Clean old images
docker image prune -a
```

---

## 🎯 Performance Optimization

### Enable Swap (for t2.micro)

```bash
# Create 2GB swap file
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Docker Optimization

```bash
# Limit container resources in docker-compose.production.yml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

---

## ✅ Post-Deployment Checklist

- [ ] EC2 instance running
- [ ] Elastic IP assigned
- [ ] DNS records configured
- [ ] Docker & Docker Compose installed
- [ ] Application container running
- [ ] Nginx container running
- [ ] SSL certificate installed
- [ ] HTTPS working (https://pahlaviforiran.com)
- [ ] Admin panel accessible
- [ ] Email sending works
- [ ] Backups scheduled
- [ ] Auto-renewal scheduled
- [ ] Security groups configured
- [ ] Monitoring set up

---

## 📚 Useful Commands Reference

```bash
# Start all services
docker-compose -f docker-compose.production.yml up -d

# Stop all services
docker-compose -f docker-compose.production.yml down

# View logs
docker-compose logs -f

# Rebuild and restart
docker-compose -f docker-compose.production.yml up -d --build

# Shell into container
docker exec -it pahlavi-blog sh

# Check container stats
docker stats

# Clean up
docker system prune -a
```

---

## 🎉 You're Live!

Your application should now be running at:
**https://pahlaviforiran.com**

Containerized, scalable, and secure! 🐳🚀
