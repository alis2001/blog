#!/bin/bash
# Deployment Script
# Run this after setup-ec2.sh

set -e

echo "🚀 Deploying Pahlavi Blog..."

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo "❌ .env.production not found!"
    echo "Creating from template..."
    cp env.production.example .env.production
    
    # Generate secrets
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    MONGO_PASSWORD=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
    
    # Update .env.production
    sed -i "s/GENERATE_RANDOM_32_CHAR_STRING_HERE/$JWT_SECRET/" .env.production
    sed -i "0,/GENERATE_RANDOM_32_CHAR_STRING_HERE/s//$SESSION_SECRET/" .env.production
    sed -i "s/CHANGE_THIS_PASSWORD/$MONGO_PASSWORD/g" .env.production
    
    echo "⚠️  IMPORTANT: Edit .env.production and update:"
    echo "   - ADMIN_PASSWORD"
    echo "   - EMAIL_PASSWORD (Gmail app password)"
    echo "   - SITE_URL (if different)"
    echo ""
    read -p "Press Enter after you've edited .env.production..."
fi

# Build and start containers
echo "🐳 Building Docker containers..."
docker-compose -f docker-compose.production.yml build

echo "🚀 Starting containers..."
docker-compose -f docker-compose.production.yml up -d

# Wait for containers to start
echo "⏳ Waiting for containers to be ready..."
sleep 15

# Check status
echo "✅ Container status:"
docker-compose -f docker-compose.production.yml ps

# Show logs
echo ""
echo "📋 Recent logs:"
docker-compose -f docker-compose.production.yml logs --tail=30

echo ""
echo "✨ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Run: ./deploy-scripts/setup-ssl.sh"
echo "2. Visit: https://pahlaviforiran.com"
