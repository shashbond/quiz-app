# Deployment Guide

This guide covers different deployment options for the Quiz App.

## Table of Contents
- [GitHub Repository Setup](#github-repository-setup)
- [Local Development](#local-development)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)

## GitHub Repository Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `quiz-app` or your preferred name
3. Choose public or private
4. Don't initialize with README (we already have one)

### 2. Push Code to GitHub

```bash
# Navigate to your project directory
cd quiz-app

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Complete quiz application with admin dashboard"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/quiz-app.git

# Push to GitHub
git push -u origin main
```

### 3. Repository Configuration

After pushing, configure your repository:

1. **Settings > General**:
   - Add description: "Online quiz platform with admin dashboard, real-time timer, and leaderboard"
   - Add topics: `quiz`, `education`, `react`, `nodejs`, `mongodb`, `realtime`

2. **Settings > Pages** (for frontend deployment):
   - Source: Deploy from a branch
   - Branch: `main` / `docs` (if using GitHub Pages)

3. **Settings > Security > Secrets and variables > Actions**:
   - Add repository secrets for deployment

## Local Development

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Git

### Setup
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/quiz-app.git
cd quiz-app

# Install dependencies
npm run install-all

# Setup environment
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Create uploads directory
mkdir -p backend/uploads

# Start development
npm run dev
```

## Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/quiz-app.git
cd quiz-app

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Setup

```bash
# Build images
docker build -t quiz-app-backend ./backend
docker build -t quiz-app-frontend ./frontend

# Run MongoDB
docker run -d --name quiz-db -p 27017:27017 mongo:5.0

# Run Backend
docker run -d --name quiz-backend \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/quiz-app \
  -e JWT_SECRET=your-secret-key \
  quiz-app-backend

# Run Frontend
docker run -d --name quiz-frontend \
  -p 3000:80 \
  quiz-app-frontend
```

## Cloud Deployment

### 1. Heroku Deployment

#### Backend Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create backend app
heroku create quiz-app-backend-yourname

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set JWT_SECRET=your-secret-key
heroku config:set CLIENT_URL=https://quiz-app-frontend-yourname.herokuapp.com

# Deploy backend
git subtree push --prefix backend heroku main
```

#### Frontend Deployment
```bash
# Create frontend app
heroku create quiz-app-frontend-yourname

# Add buildpack
heroku buildpacks:set https://github.com/mars/create-react-app-buildpack.git

# Set API URL
heroku config:set REACT_APP_API_URL=https://quiz-app-backend-yourname.herokuapp.com

# Deploy frontend
git subtree push --prefix frontend heroku main
```

### 2. Vercel Deployment (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Set environment variables in Vercel dashboard
# REACT_APP_API_URL=your-backend-url
```

### 3. Railway Deployment

#### Backend
1. Connect GitHub repository
2. Select backend folder
3. Add environment variables
4. Deploy

#### Frontend
1. Connect GitHub repository
2. Select frontend folder
3. Add build command: `npm run build`
4. Deploy

### 4. DigitalOcean App Platform

1. Create new app
2. Connect GitHub repository
3. Configure components:
   - **Backend**: Node.js service
   - **Frontend**: Static site
   - **Database**: MongoDB managed database

### 5. AWS Deployment

#### Using AWS Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init

# Create environment
eb create quiz-app-prod

# Deploy
eb deploy
```

#### Using AWS Amplify (Frontend)
1. Connect GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy

## Environment Variables

### Backend (.env)
```env
# Required
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quiz-app
JWT_SECRET=your-super-secret-jwt-key

# Optional
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
MAX_FILE_SIZE=50MB
```

### Frontend (Build-time)
```env
# Optional
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_SOCKET_URL=https://your-backend-domain.com
```

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Atlas Account**: [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster**: Choose free tier or paid tier
3. **Create Database User**: With read/write permissions
4. **Whitelist IP**: Add 0.0.0.0/0 for all IPs (or specific IPs)
5. **Get Connection String**: Use in MONGODB_URI

### Local MongoDB
```bash
# Install MongoDB
# macOS
brew install mongodb/brew/mongodb-community

# Ubuntu
sudo apt install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Connection string
MONGODB_URI=mongodb://localhost:27017/quiz-app
```

## SSL/HTTPS Setup

### Using Let's Encrypt with Nginx

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Using Cloudflare
1. Add domain to Cloudflare
2. Update DNS records
3. Enable SSL/TLS encryption

## Monitoring and Logging

### Production Monitoring
```bash
# Install PM2 for Node.js
npm install -g pm2

# Start backend with PM2
pm2 start backend/src/server.js --name quiz-backend

# Monitor
pm2 monit

# Logs
pm2 logs quiz-backend
```

### Health Checks
- Backend: `GET /health`
- Frontend: Check if app loads
- Database: Connection test

## Backup Strategy

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://your-connection-string" --out=backup/

# Restore
mongorestore --uri="mongodb://your-connection-string" backup/
```

### File Backup
```bash
# Backup uploads
tar -czf uploads-backup.tar.gz backend/uploads/
```

## Performance Optimization

### Frontend
- Enable gzip compression
- Use CDN for assets
- Implement code splitting
- Optimize images

### Backend
- Enable MongoDB indexing
- Use connection pooling
- Implement caching
- Use compression middleware

### Database
```javascript
// Add indexes for better performance
db.users.createIndex({ email: 1 })
db.quizzes.createIndex({ isActive: 1, startDate: 1 })
db.questions.createIndex({ quiz: 1, isActive: 1 })
db.quizattempts.createIndex({ participant: 1, quiz: 1 })
```

## Security Checklist

- [ ] Environment variables secured
- [ ] JWT secret is strong and unique
- [ ] Database credentials secured
- [ ] HTTPS enabled
- [ ] Input validation implemented
- [ ] File upload restrictions
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Security headers added
- [ ] Regular security updates

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string
   - Verify network access
   - Check credentials

2. **CORS Errors**
   - Update CLIENT_URL in backend
   - Check CORS configuration

3. **File Upload Issues**
   - Verify uploads directory exists
   - Check file permissions
   - Validate file size limits

4. **Socket.io Connection Issues**
   - Check firewall settings
   - Verify WebSocket support
   - Update CORS for Socket.io

### Logs and Debugging

```bash
# View application logs
tail -f logs/app.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

## Maintenance

### Regular Tasks
- Update dependencies
- Backup database
- Monitor performance
- Check error logs
- Update security patches

### Scaling
- Horizontal scaling with load balancers
- Database replica sets
- CDN for static assets
- Caching layer (Redis)

---

**Need Help?**
- Check the [README.md](README.md) for basic setup
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Create an issue on GitHub for specific problems