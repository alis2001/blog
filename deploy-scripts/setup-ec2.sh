#!/bin/bash
# EC2 Initial Setup Script
# Run this on fresh EC2 instance

set -e

echo "🚀 Setting up EC2 instance for Pahlavi Blog..."

# Update system
echo "📦 Updating system packages..."
sudo dnf update -y

# Install Docker
echo "🐳 Installing Docker..."
sudo dnf install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Git
echo "📚 Installing Git..."
sudo dnf install git -y

# Install Certbot for SSL
echo "🔒 Installing Certbot..."
sudo dnf install certbot -y

# Create backups directory
mkdir -p ~/backups

echo "✅ EC2 setup complete!"
echo ""
echo "⚠️  IMPORTANT: Logout and login again for Docker permissions to take effect!"
echo ""
echo "Next steps:"
echo "1. logout"
echo "2. ssh back in"
echo "3. Run: ./deploy-scripts/deploy.sh"
