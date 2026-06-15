# Find My Home BLR — Deployment Guide

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB Atlas account
- Cloudinary account
- Gmail account (for email)

---

## 1. MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster (M0 Sandbox)
3. Create a database user: **Security → Database Access → Add New User**
4. Whitelist your IP: **Security → Network Access → Add IP Address → Allow All** (`0.0.0.0/0` for production)
5. Get connection string: **Deployment → Database → Connect → Drivers**
6. Copy URI and replace `<username>` and `<password>`

---

## 2. Cloudinary Setup

1. Go to [https://cloudinary.com](https://cloudinary.com) and sign up free
2. In Dashboard, note your:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## 3. Gmail App Password

1. Enable 2FA on your Google account
2. Go to Google Account → Security → 2-Step Verification → App Passwords
3. Generate app password for "Mail"
4. Use this password as `EMAIL_PASS`

---

## 4. Local Development

### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
# App runs on http://localhost:5173
```

### Seed Initial Data
```bash
# From project root
node backend/utils/seeder.js
```

Login credentials after seeding:
- **Admin:** admin@findmyhomeblr.com / Admin@123
- **Agent:** agent@findmyhomeblr.com / Agent@123
- **User:** user@findmyhomeblr.com / User@123

---

## 5. Production Build

### Frontend Build
```bash
cd frontend
VITE_API_URL=https://your-api-domain.com/api npm run build
# Output in frontend/dist/
```

### Backend Production
```bash
cd backend
NODE_ENV=production node server.js
```

---

## 6. Deployment Options

### Option A: Render (Recommended Free)

**Backend:**
1. Push code to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Connect repo, set root directory to `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables from `.env.example`

**Frontend:**
1. Create new Static Site on Render
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add env var: `VITE_API_URL=https://your-backend-url.onrender.com/api`

### Option B: Railway

```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Deploy backend
cd backend
railway init
railway up

# Deploy frontend
cd frontend
railway init
railway up
```

### Option C: VPS (Ubuntu)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone and setup backend
cd /var/www
git clone <your-repo>
cd findmyhomeblr/backend
npm install
cp .env.example .env
nano .env  # Fill in values

# Start with PM2
pm2 start server.js --name "findmyhomeblr-api"
pm2 startup
pm2 save

# Build and serve frontend
cd /var/www/findmyhomeblr/frontend
npm install
npm run build

# Nginx config for frontend + proxy
sudo nano /etc/nginx/sites-available/findmyhomeblr
```

Nginx config:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/findmyhomeblr/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option D: Docker

```bash
# From project root
cp .env.example .env
# Fill in all values in .env

# Build and run
docker-compose up --build -d

# Frontend: http://localhost:80
# Backend: http://localhost:5000
```

---

## 7. Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | `supersecretkey123456789012345678` |
| `JWT_EXPIRE` | JWT expiry duration | `7d` |
| `PORT` | Server port | `5000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefghijklmnop` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email address | `you@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | Sender name | `noreply@findmyhomeblr.com` |
| `FRONTEND_URL` | Frontend URL for CORS | `https://findmyhomeblr.com` |
| `NODE_ENV` | Environment | `production` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://api.findmyhomeblr.com/api` |
| `VITE_GOOGLE_MAPS_KEY` | Google Maps API key (optional) | `AIzaSy...` |

---

## 8. API Routes Reference

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Forgot password |
| PUT | `/api/auth/reset-password/:token` | Reset password |
| PUT | `/api/auth/update-password` | Update password |

### Properties
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/properties` | List all (with filters) |
| GET | `/api/properties/featured` | Featured properties |
| GET | `/api/properties/:id` | Get single property |
| GET | `/api/properties/slug/:slug` | Get by slug |
| GET | `/api/properties/:id/similar` | Similar properties |
| POST | `/api/properties` | Create (agent+) |
| PUT | `/api/properties/:id` | Update (agent+) |
| DELETE | `/api/properties/:id` | Delete (agent+) |

### Leads
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/leads` | Create enquiry |
| GET | `/api/leads` | All leads (admin) |
| GET | `/api/leads/agent` | Agent's leads |
| GET | `/api/leads/my-enquiries` | User's enquiries |
| GET | `/api/leads/:id` | Single lead |
| PUT | `/api/leads/:id` | Update lead |
| POST | `/api/leads/:id/notes` | Add note |
| PUT | `/api/leads/:id/assign` | Assign to agent (admin) |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/saved` | Get saved properties |
| POST | `/api/users/saved/:id` | Toggle save |
| GET | `/api/users/compare` | Compare list |
| POST | `/api/users/compare/:id` | Toggle compare |

### Admin
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/analytics` | Analytics data |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id` | Update user |
| DELETE | `/api/admin/users/:id` | Delete user |
| PUT | `/api/admin/properties/:id/verify` | Verify property |
| PUT | `/api/admin/properties/:id/feature` | Feature property |

### Agent
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/agent/dashboard` | Agent dashboard |
| GET | `/api/agent/properties` | Agent properties |
| GET | `/api/agent/:id/profile` | Agent public profile |

---

## 9. Security Checklist

- [ ] Change all default passwords after seeding
- [ ] Use a strong JWT_SECRET (32+ random characters)
- [ ] Set FRONTEND_URL to your actual domain
- [ ] Enable MongoDB Atlas IP whitelist for production IPs only
- [ ] Use HTTPS in production (SSL certificate via Let's Encrypt)
- [ ] Set NODE_ENV=production
- [ ] Rotate Cloudinary API keys if compromised

---

## 10. Troubleshooting

**MongoDB connection error:**
- Check MONGO_URI format
- Ensure IP is whitelisted in Atlas
- Verify username/password

**Cloudinary upload fails:**
- Check CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Ensure uploads folder exists

**Emails not sending:**
- Use Gmail App Password, not your regular Gmail password
- Enable 2FA on Gmail first
- Check EMAIL_HOST and EMAIL_PORT

**CORS errors:**
- Set FRONTEND_URL to exact frontend origin including port
- Ensure frontend VITE_API_URL points to backend

**JWT errors:**
- JWT_SECRET must be at least 32 characters
- Check token expiry
