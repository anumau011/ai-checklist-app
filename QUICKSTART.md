# Quick Start Guide for AI Checklist App

## Prerequisites

- **Node.js** v18+ and npm
- **MongoDB** (local or cloud)
- **Google Gemini API Key** (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

## Option 1: Local Development (Recommended for Development)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your values
# Required values:
# - MONGODB_URI=mongodb://localhost:27017/ai-checklist
# - JWT_SECRET=your-random-secret-key (can be any long string)
# - GEMINI_API_KEY=your-google-gemini-api-key
```

### Start MongoDB

**Windows:**
```bash
# If installed locally
mongod

# Or use MongoDB Atlas (cloud) - just update MONGODB_URI in .env
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Using Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

### Start Backend

```bash
cd backend
npm run dev
# Backend will run on http://localhost:3000
```

### Frontend Setup

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend will run on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

---

## Option 2: Docker Compose (Full Stack in Containers)

### Prerequisites
- Docker and Docker Compose installed

### Start Everything

```bash
# From the root directory
docker-compose up -d
```

This will:
- Start MongoDB on port 27017
- Start Backend on port 3000
- Start Frontend on port 5173

View logs:
```bash
docker-compose logs -f
```

Stop everything:
```bash
docker-compose down
```

---

## Getting Your Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API Key"
3. Copy the key and paste it in your `.env` file as `GEMINI_API_KEY`

---

## Project Structure Overview

```
frontend/
├── src/
│   ├── components/     # React components (Header, ChecklistBoard, etc.)
│   ├── pages/          # Page components (Home, Login, MyChecklists)
│   ├── hooks/          # Custom hooks (useAuth)
│   ├── api/            # API client (axios setup)
│   ├── styles/         # CSS files
│   ├── App.jsx         # Main app component
│   └── main.jsx        # Entry point

backend/
├── src/
│   ├── models/         # MongoDB schemas (User, Checklist)
│   ├── routes/         # API endpoints (auth, checklist)
│   ├── services/       # Business logic (Gemini integration)
│   ├── middleware/     # Auth middleware, error handler
│   └── server.js       # Express server
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/validate      - Validate token
```

### Checklists
```
POST   /api/checklist/questions      - Generate Q&A questions
POST   /api/checklist/generate       - Generate full checklist
GET    /api/checklist/all            - Get all user checklists
GET    /api/checklist/:id            - Get specific checklist
PUT    /api/checklist/:id            - Update checklist
PUT    /api/checklist/:id/item       - Toggle item done status
DELETE /api/checklist/:id            - Delete checklist
```

---

## Example: Register and Create Checklist

### 1. Register/Login
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response:
```json
{
  "token": "eyJhbGc...",
  "user": {"id": "...", "email": "user@example.com"}
}
```

### 2. Generate Questions
```bash
curl -X POST http://localhost:3000/api/checklist/questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"topic":"React learning"}'
```

### 3. Generate Checklist
```bash
curl -X POST http://localhost:3000/api/checklist/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"topic":"React learning","answers":[...]}'
```

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running (`mongod` command)
- Check `MONGODB_URI` in `.env`
- For MongoDB Atlas, use: `mongodb+srv://user:pass@cluster.mongodb.net/ai-checklist`

### Gemini API Error
- Verify `GEMINI_API_KEY` is correct
- Check at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Ensure you have API credits

### Frontend can't connect to Backend
- Ensure backend is running on port 3000
- Check CORS settings in backend/src/server.js
- Verify frontend proxy in vite.config.js

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or change port in .env (backend) or vite.config.js (frontend)
```

---

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Creates dist/ folder ready for deployment
```

### Backend Deployment
```bash
# Update .env with production values
NODE_ENV=production
JWT_SECRET=very-long-random-secret
# Deploy to Heroku, Railway, DigitalOcean, AWS, etc.
```

---

## Next Steps

1. Test the app by registering and creating a checklist
2. Explore the code structure to understand how components work
3. Customize styling in `frontend/src/styles/`
4. Add more features as needed

Enjoy building! 🚀
