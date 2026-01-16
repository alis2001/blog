# Deployment Checklist & Progress Tracker
## pahlaviforiran.com Deployment

**Date Started:** January 16, 2026  
**Target:** https://pahlaviforiran.com

---

## ✅ Progress Tracker

### Phase 1: MongoDB Atlas Setup (5 min)
- [ ] Create MongoDB Atlas account
- [ ] Create free cluster (M0)
- [ ] Create database user
- [ ] Whitelist IP addresses (0.0.0.0/0)
- [ ] Get connection string
- [ ] Test connection

**Connection String Format:**
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/pahlavi-iran?retryWrites=true&w=majority
```

**Save your credentials here:**
- Username: _______________
- Password: _______________
- Connection String: _______________

---

### Phase 2: AWS EC2 Setup (10 min)
- [ ] Create AWS account (if needed)
- [ ] Launch EC2 instance
  - Type: t3.small (2GB RAM)
  - OS: Amazon Linux 2023
  - Storage: 30GB
- [ ] Create key pair (.pem file)
- [ ] Configure Security Groups:
  - SSH (22) - Your IP
  - HTTP (80) - Anywhere
  - HTTPS (443) - Anywhere
- [ ] Allocate Elastic IP
- [ ] Associate Elastic IP with instance

**Save your details:**
- Instance ID: _______________
- Elastic IP: _______________
- Key file location: _______________

---

### Phase 3: Domain Configuration (5 min)
- [ ] Access domain registrar DNS settings
- [ ] Add A record: @ → ELASTIC_IP
- [ ] Add A record: www → ELASTIC_IP
- [ ] Verify DNS propagation (may take up to 24 hours)

**DNS Records:**
```
Type    Name    Value           TTL
A       @       YOUR_IP_HERE    3600
A       www     YOUR_IP_HERE    3600
```

---

### Phase 4: Docker Deployment on EC2 (15 min)
- [ ] SSH to EC2 instance
- [ ] Update system packages
- [ ] Install Docker
- [ ] Install Docker Compose
- [ ] Install Git
- [ ] Clone repository
- [ ] Create .env.production file
- [ ] Add MongoDB connection string
- [ ] Generate JWT_SECRET
- [ ] Generate SESSION_SECRET
- [ ] Build Docker image
- [ ] Start containers
- [ ] Verify containers running

**Environment Variables to Configure:**
```env
✓ NODE_ENV=production
✓ PORT=3000
✓ MONGODB_URI=your_atlas_connection
✓ JWT_SECRET=generated_secret
✓ SESSION_SECRET=generated_secret
✓ ADMIN_EMAIL=admin@pahlaviforiran.com
✓ ADMIN_PASSWORD=strong_password
✓ EMAIL_USER=pahlaviforiran@gmail.com
✓ EMAIL_PASSWORD=jjhxwybvtfcpmbaw
✓ SITE_URL=https://pahlaviforiran.com
```

---

### Phase 5: SSL Certificate (5 min)
- [ ] Install Certbot
- [ ] Stop nginx container
- [ ] Request SSL certificate
- [ ] Copy certificates to nginx/ssl/
- [ ] Restart containers
- [ ] Verify HTTPS works
- [ ] Set up auto-renewal

---

### Phase 6: Testing & Verification (5 min)
- [ ] Visit https://pahlaviforiran.com
- [ ] Check SSL certificate (padlock icon)
- [ ] Test admin login
- [ ] Test newsletter subscription
- [ ] Verify welcome email arrives
- [ ] Test adding news article
- [ ] Verify news notification email
- [ ] Test contact form
- [ ] Check mobile responsiveness
- [ ] Test all pages load correctly

---

### Phase 7: Monitoring & Maintenance
- [ ] Set up backup script
- [ ] Schedule automated backups
- [ ] Set up SSL auto-renewal
- [ ] Document update procedures
- [ ] Set up monitoring alerts

---

## 📝 Quick Commands Reference

### SSH to Server
```bash
ssh -i your-key.pem ec2-user@YOUR_ELASTIC_IP
```

### View Logs
```bash
docker logs -f pahlavi-blog
docker logs -f pahlavi-nginx
```

### Restart Services
```bash
docker-compose -f docker-compose.production.yml restart
```

### Deploy Updates
```bash
cd ~/blog
git pull
docker-compose -f docker-compose.production.yml up -d --build
```

### Check Status
```bash
docker ps
docker stats
df -h
```

---

## 🆘 Emergency Contacts & Resources

**Documentation:**
- Full Guide: `AWS_EC2_DOCKER_DEPLOYMENT.md`
- Quick Start: `DOCKER_QUICK_START.md`
- Docker README: `README_DOCKER.md`

**Support Resources:**
- MongoDB Atlas: https://support.mongodb.com/
- AWS Support: https://console.aws.amazon.com/support/
- Docker Docs: https://docs.docker.com/

**Critical Files:**
- `.env.production` - Production environment variables
- `nginx/nginx.conf` - Nginx configuration
- `docker-compose.production.yml` - Docker Compose config

---

## 💰 Expected Costs

- AWS EC2 (t3.small): $15-18/month
- EBS Storage (30GB): $3/month
- MongoDB Atlas: FREE (512MB)
- SSL Certificate: FREE (Let's Encrypt)
- Domain: Already owned

**Total: ~$18-20/month**

---

## 📊 Timeline

- **Setup Time:** 45-60 minutes total
- **DNS Propagation:** Up to 24 hours
- **SSL Setup:** 5 minutes
- **First Deployment:** Complete!

---

## ✅ Post-Deployment Checklist

After going live:

- [ ] Bookmark AWS EC2 console
- [ ] Save .pem key file securely
- [ ] Document admin credentials
- [ ] Set up email notifications for AWS billing
- [ ] Schedule first backup
- [ ] Test disaster recovery plan
- [ ] Update documentation if needed
- [ ] Celebrate! 🎉

---

**Status:** 🚀 Ready to Deploy!
**Next Step:** Set up MongoDB Atlas

---

*Last Updated: January 16, 2026*
