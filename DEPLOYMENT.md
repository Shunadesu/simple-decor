# 🚀 Deployment Guide for Zuna Simple Decor

This guide covers deployment strategies for the Zuna Simple Decor full-stack application using Render (backend) and Vercel (frontend).

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- [Git](https://git-scm.com/) for version control
- [MongoDB Atlas](https://www.mongodb.com/atlas) account for database
- [Cloudinary](https://cloudinary.com/) account for image storage
- [Render](https://render.com/) account for backend hosting
- [Vercel](https://vercel.com/) account for frontend hosting

## 🏗️ Architecture Overview

```
Frontend (Client) → Vercel
Frontend (Admin)  → Vercel
Backend (API)     → Render
Database          → MongoDB Atlas
File Storage      → Cloudinary
```

## 🔧 Environment Setup

### 1. MongoDB Atlas Setup

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Whitelist IP addresses (0.0.0.0/0 for all IPs)
4. Create a database user

### 2. Cloudinary Setup

1. Sign up for Cloudinary
2. Get your credentials:
   - Cloud Name
   - API Key
   - API Secret

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Repository

1. Push your code to GitHub/GitLab
2. Ensure `render.yaml` is in root directory

### Step 2: Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your repository
4. Use these settings:
   - **Name**: `zuna-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Configure Environment Variables

Add these in Render dashboard:

```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zuna_simple_decor
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLIENT_URL=https://your-client-app.vercel.app
ADMIN_URL=https://your-admin-app.vercel.app
```

### Step 4: Deploy

Click "Create Web Service" and wait for deployment.

## 🌐 Frontend Deployment (Vercel)

### Client App Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to client directory: `cd client`
3. Login: `vercel login`
4. Deploy: `vercel --prod`
5. Set environment variables in Vercel dashboard:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

### Admin CMS Deployment

1. Navigate to admin directory: `cd admin-cms`
2. Deploy: `vercel --prod`
3. Set environment variables:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## 🐳 Docker Deployment (Alternative)

### For Local Development

```bash
# Build and run all services
npm run docker:build
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### For Production

1. Build images:

```bash
docker build -t zuna-backend ./server
docker build -t zuna-client ./client
docker build -t zuna-admin ./admin-cms
```

2. Run containers:

```bash
docker run -d -p 5000:5000 --env-file server/.env zuna-backend
docker run -d -p 3000:3000 zuna-client
docker run -d -p 3001:3001 zuna-admin
```

## 🔐 Security Considerations

### Backend Security

- Use strong JWT secrets
- Enable CORS with specific origins
- Use HTTPS in production
- Implement rate limiting
- Sanitize user inputs
- Use environment variables for secrets

### Frontend Security

- Enable security headers in nginx
- Use HTTPS only
- Implement Content Security Policy
- Avoid exposing sensitive data in client

## 🚦 Health Checks

### Backend Health Check

```bash
curl https://your-backend.onrender.com/api/health
```

Response:

```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

## 📊 Monitoring & Logs

### Render Monitoring

- Access logs in Render dashboard
- Set up log aggregation
- Monitor performance metrics

### Vercel Monitoring

- View deployment logs
- Monitor function executions
- Check analytics dashboard

## 🔄 CI/CD Pipeline

### Automatic Deployment

1. **Render**: Auto-deploys on git push to main branch
2. **Vercel**: Auto-deploys on git push (configure in settings)

### Manual Deployment Commands

```bash
# Deploy all to production
npm run deploy:render
npm run deploy:vercel:client
npm run deploy:vercel:admin

# Build locally first
npm run build
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports are not in use
2. **Environment variables**: Double-check all required vars are set
3. **CORS errors**: Verify CLIENT_URL and ADMIN_URL are correct
4. **Database connection**: Check MongoDB Atlas IP whitelist
5. **Build failures**: Check Node.js version compatibility

### Debug Commands

```bash
# Check backend health
curl https://your-backend.onrender.com/api/health

# Check environment variables
printenv | grep VITE_

# View Docker logs
docker logs container-name
```

## 📝 Post-Deployment Checklist

- [ ] Backend health check responds
- [ ] Frontend apps load correctly
- [ ] Database connection works
- [ ] File uploads work (Cloudinary)
- [ ] Authentication flows work
- [ ] Admin panel accessible
- [ ] API endpoints respond correctly
- [ ] CORS configured properly
- [ ] Environment variables set
- [ ] SSL certificates active

## 🔗 Useful Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Docker Documentation](https://docs.docker.com/)

## 📞 Support

For deployment issues, check:

1. Service status pages
2. Application logs
3. Environment variable configurations
4. Network connectivity
5. Resource usage limits

---

**Happy Deploying! 🚀**
