# Cricket Data Agent

A full-stack AI-powered cricket statistics Q&A system.

## Project Structure
- `backend/` - NestJS API gateway & LangGraph workflow. Connects to MongoDB.
- `frontend/` - Next.js chat interface.

## Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017`
- Google Gemini API Key

## Setup & Run Instructions

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```
GOOGLE_API_KEY=your_gemini_api_key_here
MONGODB_URL=mongodb://localhost:27017
DB_NAME=cricket_db
PORT=3001
```

**Seed the Database** (This will process the CSV files and insert them into MongoDB):
```bash
npm run seed
```

**Start the Backend**:
```bash
npm run start:dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to chat with the agent!

## Features
- Validates if questions are cricket-related
- Generates intelligent MongoDB aggregation pipelines using LLM
- Returns answers in text format or as rich tables
- Polished dark mode UI with Next.js
