#!/bin/bash

# Setup script for AI Checklist App

echo "🚀 AI Checklist App - Setup Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend
cp .env.example .env
npm install

echo ""
echo "⚠️  IMPORTANT - Backend Configuration:"
echo "  Edit backend/.env and add:"
echo "  - MONGODB_URI: MongoDB connection string"
echo "  - JWT_SECRET: Random secret key"
echo "  - GEMINI_API_KEY: Google Gemini API key"
echo ""
echo "  Get Gemini API key from: https://makersuite.google.com/app/apikey"
echo ""

# Setup Frontend
echo "📦 Setting up Frontend..."
cd ../frontend
cp .env.example .env
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next Steps:"
echo "  1. Edit backend/.env with your credentials"
echo "  2. Start MongoDB (mongod or Docker)"
echo "  3. Run: npm run dev (from backend directory)"
echo "  4. Run: npm run dev (from frontend directory)"
echo "  5. Visit: http://localhost:5173"
echo ""
echo "📖 For more details, see QUICKSTART.md"
