#!/bin/bash
# SSL Certificate Setup Script

set -e

DOMAIN="pahlaviforiran.com"
EMAIL="pahlaviforiran@gmail.com"

echo "🔒 Setting up SSL certificate for $DOMAIN..."

# Stop nginx temporarily
echo "🛑 Stopping nginx container..."
docker-compose -f docker-compose.production.yml stop nginx

# Get certificate
echo "📜 Requesting SSL certificate..."
sudo certbot certonly --standalone \
  -d $DOMAIN \
  -d www.$DOMAIN \
  --non-interactive \
  --agree-tos \
  --email $EMAIL

# Create ssl directory
mkdir -p nginx/ssl

# Copy certificates
echo "📋 Copying certificates..."
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem nginx/ssl/
sudo chown -R ec2-user:ec2-user nginx/ssl

# Restart all containers
echo "🚀 Restarting containers..."
docker-compose -f docker-compose.production.yml up -d

# Wait for startup
sleep 5

# Test
echo "🧪 Testing HTTPS..."
curl -I https://$DOMAIN || echo "⚠️  DNS might not be propagated yet"

echo ""
echo "✅ SSL setup complete!"
echo ""
echo "📅 Setting up auto-renewal..."

# Create renewal script
cat > ~/renew-ssl.sh << 'RENEWAL_SCRIPT'
#!/bin/bash
cd ~/blog
docker-compose -f docker-compose.production.yml stop nginx
sudo certbot renew
sudo cp /etc/letsencrypt/live/pahlaviforiran.com/*.pem nginx/ssl/
sudo chown -R ec2-user:ec2-user nginx/ssl
docker-compose -f docker-compose.production.yml up -d
RENEWAL_SCRIPT

chmod +x ~/renew-ssl.sh

# Add to crontab
(crontab -l 2>/dev/null | grep -v renew-ssl.sh; echo "0 3 1 * * ~/renew-ssl.sh") | crontab -

echo "✅ Auto-renewal configured (runs monthly)"
echo ""
echo "🎉 All done! Visit: https://$DOMAIN"
