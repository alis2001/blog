# Docker Deployment Files

This directory contains all necessary files for Docker deployment.

## 📁 Files Overview

### Docker Files
- **`Dockerfile`** - Production-optimized Node.js application image
- **`docker-compose.yml`** - Local development with MongoDB
- **`docker-compose.production.yml`** - Production deployment (uses MongoDB Atlas)
- **`.dockerignore`** - Files to exclude from Docker image

### Nginx Configuration
- **`nginx/nginx.conf`** - Reverse proxy, SSL, security headers, caching
- **`nginx/ssl/`** - Directory for SSL certificates (create on server)

### Environment Files
- **`env.example`** - Development environment template
- **`env.production.example`** - Production environment template

### Documentation
- **`AWS_EC2_DOCKER_DEPLOYMENT.md`** - Complete AWS EC2 deployment guide
- **`DOCKER_QUICK_START.md`** - Quick start guide (30 minutes)
- **`PRODUCTION_DEPLOYMENT.md`** - Traditional deployment (non-Docker)

---

## 🚀 Quick Start

### Local Development
```bash
# Copy environment file
cp env.example .env

# Start with Docker Compose
docker-compose up

# Access at http://localhost:3000
```

### Production Deployment
```bash
# Copy production environment file
cp env.production.example .env.production

# Edit with your actual values
nano .env.production

# Build and deploy
docker-compose -f docker-compose.production.yml up -d --build
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           Docker Host (EC2)             │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────┐    ┌───────────────┐  │
│  │   Nginx     │───▶│   Node.js     │  │
│  │ Container   │    │   App         │  │
│  │ (Port 80/   │    │ Container     │  │
│  │  443)       │    │ (Port 3000)   │  │
│  └─────────────┘    └───────────────┘  │
│         │                    │          │
└─────────┼────────────────────┼──────────┘
          │                    │
          ▼                    ▼
    Internet              MongoDB Atlas
```

---

## 📋 Pre-Deployment Checklist

### Required Services
- [ ] AWS EC2 instance (t3.small recommended)
- [ ] MongoDB Atlas account (free tier available)
- [ ] Domain configured (pahlaviforiran.com)
- [ ] Gmail App Password for email sending

### Configuration Files
- [ ] `.env.production` created and filled
- [ ] MongoDB connection string added
- [ ] JWT and Session secrets generated
- [ ] Email credentials configured
- [ ] SITE_URL updated to production domain

---

## 🔧 Docker Commands

### Build & Run
```bash
# Build image
docker build -t pahlavi-blog .

# Run container
docker run -p 3000:3000 --env-file .env pahlavi-blog

# Use Docker Compose (recommended)
docker-compose -f docker-compose.production.yml up -d
```

### Management
```bash
# View logs
docker logs -f pahlavi-blog

# Shell into container
docker exec -it pahlavi-blog sh

# Check resources
docker stats

# Stop containers
docker-compose -f docker-compose.production.yml down
```

### Maintenance
```bash
# Update deployment
docker-compose -f docker-compose.production.yml up -d --build

# Clean up unused images
docker system prune -a

# View disk usage
docker system df
```

---

## 🔒 Security Features

### Dockerfile
- ✅ Non-root user (node)
- ✅ Minimal Alpine Linux base
- ✅ Production dependencies only
- ✅ Health checks configured

### Nginx
- ✅ SSL/TLS (Let's Encrypt)
- ✅ HTTP to HTTPS redirect
- ✅ Security headers (HSTS, CSP, etc.)
- ✅ Rate limiting
- ✅ Static file caching

### Environment
- ✅ Environment variables for secrets
- ✅ MongoDB Atlas (secure cloud database)
- ✅ Session security
- ✅ CORS protection

---

## 📊 Monitoring

### Application Logs
```bash
# Real-time logs
docker-compose logs -f app

# Last 100 lines
docker logs --tail 100 pahlavi-blog

# Error logs only
docker logs pahlavi-blog 2>&1 | grep -i error
```

### System Resources
```bash
# Container resource usage
docker stats

# Disk usage
df -h
docker system df

# Memory usage
free -h
```

### Health Check
```bash
# Check if app is healthy
docker inspect --format='{{json .State.Health}}' pahlavi-blog

# Manual health check
curl http://localhost:3000/
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Deploy to EC2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ec2-user
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd ~/blog
            git pull
            docker-compose -f docker-compose.production.yml up -d --build
```

---

## 💰 Cost Breakdown

### AWS EC2 (t3.small)
- Instance: $15.18/month
- EBS Storage (30GB): $3/month
- Data Transfer (first 100GB): FREE
- Elastic IP: FREE (when associated)

### Other Services
- MongoDB Atlas: FREE (512MB tier)
- Let's Encrypt SSL: FREE
- Docker: FREE

**Total: ~$18-20/month**

---

## 🆘 Troubleshooting

### Container Won't Start
```bash
# Check logs for errors
docker-compose logs

# Verify environment variables
docker-compose config

# Rebuild from scratch
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Database Connection Failed
```bash
# Test MongoDB connection
docker exec -it pahlavi-blog node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(err => console.log(err))"

# Check .env.production
cat .env.production | grep MONGODB_URI
```

### Out of Memory
```bash
# Check memory usage
free -h
docker stats

# Add swap (for small instances)
sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
sudo mkswap /swapfile
sudo swapon /swapfile
```

### SSL Issues
```bash
# Check certificates
ls -la nginx/ssl/

# Renew certificates
sudo certbot renew

# Copy to nginx directory
sudo cp /etc/letsencrypt/live/pahlaviforiran.com/*.pem nginx/ssl/
```

---

## 📚 Additional Resources

- **Full AWS Guide**: `AWS_EC2_DOCKER_DEPLOYMENT.md`
- **Quick Start**: `DOCKER_QUICK_START.md`
- **Traditional Deployment**: `PRODUCTION_DEPLOYMENT.md`
- **Docker Docs**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/
- **AWS EC2**: https://aws.amazon.com/ec2/

---

## ✅ Post-Deployment

After deployment, verify:

1. **Website**: https://pahlaviforiran.com ✅
2. **SSL**: Check padlock icon ✅
3. **Admin**: https://pahlaviforiran.com/admin ✅
4. **Email**: Test newsletter subscription ✅
5. **Performance**: Check page load speed ✅
6. **Mobile**: Test responsive design ✅

---

**Your application is now containerized and ready for production! 🐳🚀**
