#!/bin/bash

# ARIA Navigator Deployment Script
set -e

echo "🚀 Starting ARIA Navigator deployment..."

# Check if required environment variables are set
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Error: VERCEL_TOKEN environment variable is not set"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm run test

# Type checking
echo "🔍 Running type check..."
npm run type-check

# Linting
echo "🔧 Running linter..."
npm run lint

# Build the application
echo "🏗️ Building application..."
npm run build:production

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
if [ "$1" = "production" ]; then
    echo "Deploying to production..."
    vercel --prod --token=$VERCEL_TOKEN
else
    echo "Deploying to preview..."
    vercel --token=$VERCEL_TOKEN
fi

echo "✅ Deployment completed successfully!"
echo "🌍 Your application is now live!"
