# Architecture & Implementation Guide

## Project Overview

This is a full-stack AI Checklist application with the following architecture:

```
User Browser
    ↓
Frontend (React + Vite)
    ↓ (REST API calls)
Backend (Express + Node.js)
    ↓ (AI Generation)
Google Gemini API
    ↓
Database (MongoDB)
```

## Technology Stack

### Frontend
- **React 18**: UI library with hooks
- **Vite**: Fast build tool and dev server
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client with interceptors for JWT
- **CSS**: Custom styling with CSS variables for theming

### Backend
- **Express.js**: Lightweight web framework
- **MongoDB**: NoSQL database for flexible schema
- **Mongoose**: Object modeling for MongoDB
- **JWT**: Stateless authentication
- **bcrypt**: Password hashing and verification
- **Google Generative AI SDK**: Gemini API integration
- **CORS**: Cross-origin resource sharing

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **npm**: Package manager

---

## Code Organization

### Frontend Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── client.js                 # Axios instance + API methods
│   ├── hooks/
│   │   └── useAuth.js               # Authentication logic
│   ├── components/
│   │   ├── Header.jsx               # Navigation header
│   │   ├── QuickTopics.jsx          # Quick topic selection
│   │   ├── WizardChat.jsx           # Q&A interface
│   │   ├── ChecklistBoard.jsx       # Checklist display & editing
│   │   ├── SectionCard.jsx          # Section component
│   │   └── ChecklistCard.jsx        # Checklist preview card
│   ├── pages/
│   │   ├── Login.jsx                # Authentication page
│   │   ├── Home.jsx                 # Main checklist creation page
│   │   └── MyChecklists.jsx         # User checklists list
│   ├── styles/
│   │   ├── App.css                  # Global styles
│   │   ├── Header.css
│   │   ├── Auth.css
│   │   ├── Home.css
│   │   ├── MyChecklists.css
│   │   ├── WizardChat.css
│   │   ├── ChecklistBoard.css
│   │   ├── SectionCard.css
│   │   ├── ChecklistCard.css
│   │   └── QuickTopics.css
│   ├── App.jsx                      # Main component + routing
│   └── main.jsx                     # React entry point
├── vite.config.js                   # Vite configuration with proxy
├── index.html                       # HTML entry point
└── package.json
```

### Backend Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── auth.js                  # /api/auth endpoints
│   │   │   ├── POST /register       # User registration
│   │   │   ├── POST /login          # User login
│   │   │   └── GET /validate        # Token validation
│   │   └── checklist.js             # /api/checklist endpoints
│   │       ├── POST /questions      # Generate Q&A
│   │       ├── POST /generate       # Generate checklist
│   │       ├── GET /all             # Get all checklists
│   │       ├── GET /:id             # Get one checklist
│   │       ├── PUT /:id             # Update checklist
│   │       ├── PUT /:id/item        # Update item status
│   │       └── DELETE /:id          # Delete checklist
│   ├── models/
│   │   ├── User.js                  # User schema & authentication
│   │   └── Checklist.js             # Checklist schema
│   ├── services/
│   │   └── geminiService.js         # Gemini API integration
│   ├── middleware/
│   │   ├── auth.js                  # JWT authentication middleware
│   │   └── errorHandler.js          # Global error handling
│   └── server.js                    # Express app setup
└── package.json
```

---

## Key Features Implementation

### 1. Authentication Flow

**Registration/Login (Frontend)**
```
User inputs email/password
    ↓
API call: POST /api/auth/register | POST /api/auth/login
    ↓
Backend validates credentials
    ↓
Backend generates JWT token
    ↓
Frontend stores token in localStorage
    ↓
Frontend redirects to home page
```

**Protected Routes**
- `useAuth()` hook checks localStorage for token on app load
- `authenticateToken` middleware on backend validates JWT
- All API requests include token in Authorization header

### 2. Checklist Generation Flow

```
User enters topic
    ↓
Click "Start" button
    ↓
Frontend calls: POST /api/checklist/questions
    ↓
Backend calls Gemini API: "Generate 3 clarifying questions"
    ↓
Gemini returns JSON questions
    ↓
Frontend displays Q&A interface
    ↓
User answers questions
    ↓
Frontend calls: POST /api/checklist/generate (with answers)
    ↓
Backend calls Gemini API: "Generate checklist based on answers"
    ↓
Backend creates Checklist in MongoDB
    ↓
Frontend displays checklist board with sections & items
```

### 3. Data Models

**User Model**
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed with bcrypt),
  createdAt: Date
}
```

**Checklist Model**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref to User),
  title: String,
  subtitle: String,
  sections: [
    {
      _id: ObjectId,
      title: String,
      items: [
        {
          _id: ObjectId,
          text: String,
          done: Boolean
        }
      ]
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### 4. API Response Examples

**Generate Questions**
```json
{
  "questions": [
    {
      "question": "What is your experience level?",
      "options": ["Beginner", "Intermediate", "Advanced", "Expert"]
    },
    {
      "question": "What's your goal?",
      "options": ["Learning", "Interview prep", "Quick reference"]
    }
  ]
}
```

**Generate Checklist**
```json
{
  "_id": "...",
  "userId": "...",
  "title": "React Learning Checklist",
  "subtitle": "...",
  "sections": [
    {
      "_id": "...",
      "title": "Fundamentals",
      "items": [
        {
          "_id": "...",
          "text": "Learn JSX syntax and components",
          "done": false
        }
      ]
    }
  ],
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

## Authentication Details

### JWT Payload
```javascript
{
  "id": "user_id",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290  // 7 days
}
```

### Request Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## Gemini API Integration

### Question Generation Prompt
```
You generate clarifying questions to tailor a checklist. 
Respond ONLY with valid JSON array, no markdown, no extra text. 
Format: [{"question":"...","options":["opt1","opt2","opt3","opt4"]}]. 
Generate exactly 3 questions...
```

### Checklist Generation Prompt
```
You create structured checklists. 
Respond ONLY with valid JSON, no markdown, no extra text. 
Format: {"title":"...","subtitle":"...","sections":[...]}.
Create 4-6 sections with 4-8 items each...
```

---

## Development Workflow

### Adding a New Feature

1. **Create Backend Endpoint**
   - Add route in `backend/src/routes/`
   - Create model if needed in `backend/src/models/`
   - Add business logic in `backend/src/services/`

2. **Create Frontend Component**
   - Create component in `frontend/src/components/`
   - Add API call in `frontend/src/api/client.js`
   - Create styles in `frontend/src/styles/`

3. **Update Routing (if needed)**
   - Add page in `frontend/src/pages/`
   - Update routing in `frontend/src/App.jsx`

4. **Test**
   - Test backend with curl or Postman
   - Test frontend in browser
   - Check database with MongoDB Compass

---

## Performance Optimizations

1. **Frontend**
   - Code splitting with React Router
   - Lazy loading components
   - CSS variables for efficient theming
   - Axios interceptors for token management

2. **Backend**
   - MongoDB indexing on userId
   - JWT expiration for security
   - Error handling middleware
   - CORS configuration

3. **Database**
   - Mongoose schema validation
   - ObjectId indexing on userId
   - Proper data modeling

---

## Security Measures

1. **Authentication**
   - Passwords hashed with bcrypt (10 salt rounds)
   - JWT with 7-day expiration
   - Token validation on protected routes

2. **Authorization**
   - Users can only access their own checklists
   - Backend validates userId ownership

3. **Input Validation**
   - Email format validation
   - Password length requirements
   - Required field checks

4. **CORS**
   - Only allow requests from frontend origin

---

## Environment Variables

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ai-checklist
JWT_SECRET=your_jwt_secret_key_change_in_production
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

---

## Deployment Considerations

1. **Frontend**
   - Build: `npm run build`
   - Deploy dist/ to Vercel, Netlify, GitHub Pages
   - Set VITE_API_URL to production backend URL

2. **Backend**
   - Use environment variables for sensitive data
   - Deploy to Heroku, Railway, AWS, DigitalOcean
   - Ensure MongoDB Atlas connection string in production

3. **Database**
   - Use MongoDB Atlas for production
   - Enable authentication
   - Configure IP whitelist

---

This architecture provides a scalable, modular, and maintainable foundation for the AI Checklist application.
