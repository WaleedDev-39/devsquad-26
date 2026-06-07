# Voice-Enabled Healthcare Chatbot

An AI-powered healthcare assistant chatbot that supports both voice and text inputs, built with a Next.js frontend and a NestJS backend. Integrated with Groq AI API for chat intent detection and voice-to-text fallback transcription using Whisper.

## Key Features
- **🎤 Web Speech API integration**: Free and fast browser-native Speech-to-Text.
- **🎙️ Groq Whisper Fallback**: Cross-browser fallback using media recorders sent to Groq's Whisper Large v3.
- **🔊 Text-to-Speech (TTS)**: Instant read-back using the Web Speech Synthesis API.
- **🎙️ Voice Mode**: Continuous hands-free interaction (auto-listens after response).
- **📊 MongoDB Analytics**: Tracks voice vs. text query stats and intent analytics.
- **💊 Medical Product Catalog**: Intelligent lookup and suggestions displayed as cards.

---

## ⚙️ Environment Variables Setup

### Backend (`/backend/.env`)
Create a file named `.env` in the `backend/` directory:
```env
MONGODB_URI=mongodb://localhost:27017/healthcare-chatbot
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Frontend (`/frontend/.env.local`)
Create a file named `.env.local` in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🚀 How to Run

### 1. Start MongoDB
Ensure MongoDB is running locally on port `27017` (e.g. via Docker or local installation).
```bash
# If using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Run NestJS Backend
```bash
cd backend
npm install
npm run start:dev
```
- Server: `http://localhost:3001`
- Swagger Docs: `http://localhost:3001/api/docs`

### 3. Run Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
- Chat Interface: `http://localhost:3000`
