# FeeTracka Deployment Guide

## Overview
FeeTracka is a full-stack application with a React frontend and Express.js backend. This guide covers deployment to popular cloud platforms.

## Prerequisites
- Node.js 18+ installed locally
- Git repository (GitHub/GitLab)
- Database (MongoDB/PostgreSQL) hosted or cloud service

## Frontend Deployment (Vercel)

### 1. Prepare the Frontend
```bash
cd client
npm install
npm run build
```

### 2. Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Follow prompts and select the `client` directory

### 3. Environment Variables
Set these in Vercel dashboard:
- `VITE_API_URL`: Your backend URL (e.g., `https://your-app.railway.app`)

## Backend Deployment (Railway)

### 1. Prepare the Backend
```bash
cd server
npm install
```

### 2. Deploy to Railway
1. Visit [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the `server` directory as root
4. Railway will auto-detect Node.js and deploy

### 3. Environment Variables
Set these in Railway dashboard:
- `DATABASE_URL`: Your database connection string
- `JWT_SECRET`: Your JWT secret key
- `PORT`: Railway will set this automatically
- Any other environment variables from your `.env` file

## Alternative Deployment Options

### Backend on Render
1. Connect GitHub repository to Render
2. Select Node.js environment
3. Set build command: `npm install`
4. Set start command: `node index.js`
5. Add environment variables

### Backend on Heroku
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Add buildpack: `heroku buildpacks:set heroku/nodejs`
4. Deploy: `git push heroku main`

## Database Setup
- **MongoDB**: Use MongoDB Atlas (free tier available)
- **PostgreSQL**: Use Railway PostgreSQL, Supabase, or Neon

## Post-Deployment Checklist
- [ ] Frontend loads correctly
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] CORS is configured for production URLs
- [ ] Environment variables are set
- [ ] SSL certificates are active

## Troubleshooting
- Check application logs in your deployment platform
- Verify environment variables are set correctly
- Ensure database is accessible from your deployed backend
- Check CORS configuration for production domains
