# AI Checklist App

A full-stack application for AI-powered checklist generation using React, Vite, Node.js, Express, MongoDB, and Google's Gemini API.

## Project Structure

```
ai-checklist-app/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── api/           # API client
│   │   ├── styles/        # CSS files
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
└── backend/               # Node.js + Express backend
    ├── src/
    │   ├── routes/        # API routes
    │   ├── models/        # MongoDB models
    │   ├── services/      # Business logic
    │   ├── middleware/    # Express middleware
    │   └── server.js      # Express app entry
    ├── package.json
    ├── .env.example
    └── README.md
```

## Features

- **Authentication**: JWT-based user authentication with bcrypt password hashing
- **AI-Powered Generation**: Uses Google Gemini API to generate checklists
- **Interactive Wizard**: Step-by-step Q&A to tailor checklists
- **Persistence**: MongoDB for storing checklists and user data
- **Modular Frontend**: Component-based React architecture
- **RESTful Backend**: Clean API design with Express

## Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Start development server on http://localhost:5173
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Update .env with:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string
# - GEMINI_API_KEY: Your Google Gemini API key
# - PORT: 3000 (default)

npm run dev  # Start development server on http://localhost:3000
```

## Environment Variables

### Frontend (.env or in vite.config.js)
```
VITE_API_URL=http://localhost:3000/api
```

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai-checklist
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validate JWT token

### Checklists
- `POST /api/checklist/questions` - Generate clarifying questions
- `POST /api/checklist/generate` - Generate full checklist
- `GET /api/checklist/all` - Get all user checklists
- `GET /api/checklist/:id` - Get specific checklist
- `PUT /api/checklist/:id` - Update checklist
- `PUT /api/checklist/:id/item` - Update checklist item
- `DELETE /api/checklist/:id` - Delete checklist

## Getting Started

1. **Install Node.js** (v18+) and MongoDB

2. **Start MongoDB**:
```bash
# On Windows
mongod

# Or use MongoDB Atlas cloud service
```

3. **Set up Backend**:
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

4. **Set up Frontend** (in a new terminal):
```bash
cd frontend
npm install
npm run dev
```

5. **Access the app** at `http://localhost:5173`

## Technologies Used

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **CSS**: Styling (no framework for lightweight design)

### Backend
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **bcrypt**: Password hashing
- **Google Generative AI**: Gemini API client

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev      # Start with auto-reload
npm start        # Start server
```

## Production Deployment

### Frontend (Vercel, Netlify, etc.)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
```

### Backend (Heroku, Railway, DigitalOcean, etc.)
```bash
cd backend
npm install --production
npm start
```

Update environment variables in production platform settings.

## License

MIT
