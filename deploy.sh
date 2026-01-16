#!/bin/bash

# AURA Casino Deployment Script for Fly.io

echo "🚀 AURA Casino Deployment Script"
echo "=================================="

# Check if fly CLI is installed
if ! command -v fly &> /dev/null; then
    echo "❌ Fly CLI is not installed!"
    echo "Install it with: iwr https://fly.io/install.ps1 -useb | iex"
    exit 1
fi

# Check if logged in
if ! fly auth whoami &> /dev/null; then
    echo "⚠️  Not logged in to Fly.io"
    echo "Please run: fly auth login"
    exit 1
fi

echo "✅ Fly CLI is installed and you are logged in"

# Check if app exists
if fly apps list | grep -q "auraslots"; then
    echo "✅ App 'auraslots' already exists"
else
    echo "📦 Creating new app 'auraslots'..."
    fly launch --name auraslots --region iad --no-deploy
fi

# Set secrets (user needs to provide these)
echo ""
echo "📝 Setting up secrets..."
echo "Please provide the following:"
read -p "Telegram Bot Token: " BOT_TOKEN
read -p "Telegram ID for admin (@BronhoFather): " ADMIN_ID

fly secrets set TELEGRAM_BOT_TOKEN="$BOT_TOKEN"
fly secrets set TELEGRAM_WEBAPP_URL="https://auraslots.fly.dev"
fly secrets set ADMIN_IDS="$ADMIN_ID"
fly secrets set NODE_ENV="production"

echo "✅ Secrets configured"

# Deploy
echo ""
echo "🚀 Deploying to Fly.io..."
fly deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📱 Your Mini App URL: https://auraslots.fly.dev"
echo "🔧 Admin Panel: https://auraslots.fly.dev/api/admin/dashboard"
echo "❤️  Health Check: https://auraslots.fly.dev/health"
echo ""
echo "Next steps:"
echo "1. Set Menu Button in @BotFather with URL: https://auraslots.fly.dev"
echo "2. Test the app in Telegram"
echo "3. Check logs with: fly logs"
