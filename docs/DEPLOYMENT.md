# 🚀 Deployment Guide

This guide covers deploying Lumio Notes to various platforms with step-by-step instructions for production deployment.

## 📋 Pre-Deployment Checklist

### Code Preparation
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Build process completes successfully
- [ ] Environment variables documented
- [ ] API endpoints tested and working
- [ ] Email functionality verified

### Security Review
- [ ] API keys stored in environment variables only
- [ ] No sensitive data in codebase
- [ ] Error messages don't expose system details
- [ ] Input validation implemented
- [ ] CORS policies configured

### Performance Optimization
- [ ] Build optimizations enabled
- [ ] Static assets properly configured
- [ ] API response times acceptable
- [ ] Error handling robust

---

## 🌐 Vercel Deployment (Recommended)

Vercel is the recommended platform for Next.js applications with seamless integration.

### Step 1: Prepare Repository
```bash
# Ensure your code is in a Git repository
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Connect to Vercel
1. Visit [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `lumio-notes` project

### Step 3: Configure Build Settings
```bash
# Framework Preset: Next.js
# Build Command: npm run build (default)
# Output Directory: .next (default)
# Install Command: npm install (default)
```

### Step 4: Environment Variables
In Vercel dashboard, add these environment variables:

```bash
# Production Environment Variables
QROQ_API_KEY=your_production_groq_key
GMAIL_USER=your_production_email@gmail.com
GMAIL_PASS=your_production_app_password

# Optional: Custom domain configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Test deployed application
4. Configure custom domain (optional)

### Vercel Configuration File (Optional)
Create `vercel.json` for advanced configuration:

```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "functions": {
    "src/app/api/**": {
      "maxDuration": 30
    }
  }
}
```

---

## 🐳 Docker Deployment

For containerized deployment with full control over the environment.

### Dockerfile
Create `Dockerfile` in project root:

```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  lumio-notes:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - QROQ_API_KEY=${QROQ_API_KEY}
      - GMAIL_USER=${GMAIL_USER}
      - GMAIL_PASS=${GMAIL_PASS}
    restart: unless-stopped
    
  # Optional: Add reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - lumio-notes
    restart: unless-stopped
```

### Build and Deploy
```bash
# Build Docker image
docker build -t lumio-notes .

# Run with environment variables
docker run -p 3000:3000 \
  -e QROQ_API_KEY=your_key \
  -e GMAIL_USER=your_email \
  -e GMAIL_PASS=your_password \
  lumio-notes

# Or use Docker Compose
docker-compose up -d
```

---

## ☁️ AWS Deployment

Deploy to AWS using Elastic Beanstalk for managed infrastructure.

### Step 1: Install EB CLI
```bash
pip install awsebcli
eb --version
```

### Step 2: Initialize Elastic Beanstalk
```bash
eb init lumio-notes
# Select region
# Choose Node.js platform
# Setup SSH if needed
```

### Step 3: Create Environment
```bash
eb create production
# Wait for environment creation
```

### Step 4: Configure Environment Variables
```bash
eb setenv QROQ_API_KEY=your_key GMAIL_USER=your_email GMAIL_PASS=your_password
```

### Step 5: Deploy
```bash
eb deploy
eb open  # Open in browser
```

### AWS Configuration Files

`.ebextensions/nodejs.config`:
```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: "18"
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: "production"
    NPM_USE_PRODUCTION: "true"
```

---

## 🌊 DigitalOcean App Platform

Simple deployment with managed infrastructure.

### Step 1: Create App
1. Visit [DigitalOcean Apps](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub repository
3. Select your `lumio-notes` repository

### Step 2: Configure Build Settings
```yaml
# app.yaml
name: lumio-notes
services:
  - name: web
    source_dir: /
    github:
      repo: your-username/lumio-notes
      branch: main
    run_command: npm start
    build_command: npm run build
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
    envs:
      - key: NODE_ENV
        value: production
      - key: QROQ_API_KEY
        value: your_key
        type: SECRET
      - key: GMAIL_USER
        value: your_email
        type: SECRET
      - key: GMAIL_PASS
        value: your_password
        type: SECRET
```

### Step 3: Deploy
1. Configure environment variables in dashboard
2. Deploy application
3. Test functionality

---

## 🏠 Self-Hosted Deployment

Deploy on your own server with PM2 for process management.

### Step 1: Server Setup
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Create user for application
sudo useradd -m -s /bin/bash lumio
sudo su - lumio
```

### Step 2: Deploy Application
```bash
# Clone repository
git clone <repository-url> lumio-notes
cd lumio-notes

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Create environment file
cat > .env.local << EOF
NODE_ENV=production
QROQ_API_KEY=your_key
GMAIL_USER=your_email
GMAIL_PASS=your_password
EOF
```

### Step 3: PM2 Configuration
Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'lumio-notes',
    script: 'npm',
    args: 'start',
    cwd: '/home/lumio/lumio-notes',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }],

  deploy: {
    production: {
      user: 'lumio',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:username/lumio-notes.git',
      path: '/home/lumio/lumio-notes',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
```

### Step 4: Start Application
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor application
pm2 status
pm2 logs lumio-notes
```

### Step 5: Nginx Reverse Proxy
```nginx
# /etc/nginx/sites-available/lumio-notes
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/lumio-notes /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# Core Application
NODE_ENV=production
PORT=3000

# AI Service
QROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email Service
GMAIL_USER=your-production-email@gmail.com
GMAIL_PASS=your-16-character-app-password

# Optional: Monitoring and Analytics
NEXT_TELEMETRY_DISABLED=1
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Optional: Custom Domain
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Environment Files**: Add `.env*` to `.gitignore`
3. **HTTPS**: Always use HTTPS in production
4. **CSP Headers**: Configure Content Security Policy
5. **Rate Limiting**: Implement API rate limiting

---

## 📊 Monitoring & Maintenance

### Health Check Endpoint
Add to `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
}
```

### Monitoring Setup

```bash
# Check application status
curl https://your-domain.com/api/health

# Monitor logs (PM2)
pm2 logs lumio-notes --lines 100

# Monitor logs (Docker)
docker logs lumio-notes-container --tail 100 -f

# Check resource usage
pm2 monit  # PM2 monitoring
docker stats  # Docker monitoring
```

### Backup Strategy

1. **Code**: Regular Git commits and tags
2. **Environment**: Secure backup of environment variables
3. **Logs**: Log aggregation and retention
4. **Monitoring**: Uptime monitoring and alerts

---

## 🚨 Troubleshooting

### Common Deployment Issues

**Build Failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check build locally
npm run build
```

**Environment Variable Issues:**
```bash
# Verify variables are set
echo $QROQ_API_KEY
printenv | grep GMAIL

# Test API endpoints
curl -X POST https://your-domain.com/api/health
```

**Performance Issues:**
```bash
# Check memory usage
free -h
pm2 show lumio-notes

# Monitor API response times
curl -w "@curl-format.txt" -s -o /dev/null https://your-domain.com/api/summarize
```

### Rollback Procedures

**Vercel:**
```bash
# Rollback to previous deployment
vercel rollback [deployment-url]
```

**PM2:**
```bash
# Keep previous version
git checkout previous-tag
npm run build
pm2 reload ecosystem.config.js
```

**Docker:**
```bash
# Use previous image
docker run previous-image-tag
docker-compose down && docker-compose up -d
```

---

## 📈 Scaling Considerations

### Horizontal Scaling
- Multiple application instances
- Load balancer configuration
- Session management (if needed)

### Vertical Scaling
- Increased memory allocation
- CPU optimization
- Database optimization (if added)

### CDN Integration
- Static asset delivery
- Global edge locations
- Cache optimization

---

For additional deployment support, refer to the main README.md or create an issue in the project repository.
