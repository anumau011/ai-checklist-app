# AI Checklist Backend

Backend for the AI Checklist application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your values:
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `GEMINI_API_KEY`: Your Google Gemini API key

4. Start the server:
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/validate` - Validate JWT token

### Checklists
- `POST /api/checklist/questions` - Generate questions for a topic
- `POST /api/checklist/generate` - Generate full checklist
- `GET /api/checklist/all` - Get all checklists for user
- `GET /api/checklist/:id` - Get specific checklist
- `PUT /api/checklist/:id` - Update checklist
- `DELETE /api/checklist/:id` - Delete checklist
- `PUT /api/checklist/:id/item` - Update checklist item

## Database Schema

### User
- email: string (unique)
- password: string (hashed)
- createdAt: Date

### Checklist
- userId: ObjectId
- title: string
- subtitle: string
- sections: Array
  - title: string
  - items: Array
    - text: string
    - done: boolean
- createdAt: Date
- updatedAt: Date
