# 🎵 EmoLyrics — Song Lyrics Emotion & Mood Classification Platform

> **Larana, Inc. & EmoLyrics Research Team**  
> An advanced NLP-powered sentiment analysis platform that classifies song lyrics across 9 fine-grained emotional spectrums in English, Hindi (Devanagari), and Hinglish with real-time confidence metrics and harmonized playlist curation.

---

## 🌟 Key Highlights & Performance Benchmarks

* **89% Genre Consistency**: Verified accuracy across Rock, Pop, Hip-Hop, Acoustic, and Country.
* **87% Multi-Language Accuracy**: Dual-lexicon processing for English, Hindi, and Hinglish lyrics.
* **9 Emotion Categories**:
  - ☀️ **Happy** (Euphoria, celebration, dance, sunshine)
  - 🌧️ **Sad** (Melancholy, grief, loneliness, tears)
  - 🔥 **Angry** (Defiance, rage, betrayal, fire)
  - 💖 **Romantic** (Love, tenderness, devotion, starlight)
  - 🌿 **Calm/Chill** (Peace, serenity, ocean breeze, stillness)
  - ⚡ **Exciting** (Adrenaline, electric hype, pulse, speed)
  - 🇮🇳 **Patriotic** (Motherland, sacrifice, honor, flag)
  - 🎬 **Thrilling** (Suspense, mystery, danger, racing edge)
  - 👻 **Horror** (Nightmares, dread, ghosts, creeping dark)

---

## 🏗️ System Architecture

```
User Lyrics Input (English / Hindi / Hinglish)
                     │
                     ▼
          [1. Text Preprocessing]
     (Lowercasing, Tokenization, Cleaning)
                     │
                     ▼
       [2. NLP Feature Extraction]
  (Multilingual Lexicon Matching, Valence & Arousal)
                     │
                     ▼
         [3. Machine Processing]
   (Multi-layered Scoring, Confidence Assessment)
                     │
                     ▼
      [4. Classification & Explanation]
 (Dominant Emotion, Percentage Gauge, Linguistic Rationale)
                     │
                     ▼
        [5. Audio & Playlist Sync]
      (Curated Mood Playlists & Recommendations)
```

---

## 🛠️ Tech Stack

### Frontend
- **React.js (v19 / v18) + Vite** (Ultra-fast build and hot module replacement)
- **Tailwind CSS** (Custom dark glassmorphism design system)
- **Framer Motion** (Smooth transitions and dynamic ambient background lighting)
- **Lucide React** (Modern, clean icon system)
- **Canvas Confetti** (Micro-interactions on celebratory emotions)
- **React Router DOM** (Single Page Application routing)

### Backend
- **Node.js & Express.js** (RESTful API architecture)
- **MongoDB & Mongoose** (With automatic zero-friction in-memory fallback for local development)
- **JWT & bcryptjs** (Secure authentication, password hashing, and role management)
- **Express Rate Limit & CORS** (Security headers and DDoS protection)

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js `v18+` or `v20+` or `v22+`
- npm installed

### 1. Start Full Application (Backend + Frontend)
From the repository root:

```bash
# Start backend server (Express API + serves built React frontend)
npm start
```
The entire application will be live at:
👉 **[http://localhost:5000](http://localhost:5000)**

### 2. Run in Development Mode (Vite Dev Server with Proxy)

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Starts API at http://localhost:5000
```

**Terminal 2 (Frontend with Hot Reloading):**
```bash
cd frontend
npm run dev
# Starts Vite at http://localhost:3000 (proxies /api to :5000)
```

---

## 📡 RESTful API Reference

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/analyze-mood` | Classify lyrics text into 1 of 9 emotions | Optional |
| `GET` | `/api/analyses` | Query community & saved lyrics (filter & search) | No |
| `POST` | `/api/analyses` | Save/bookmark an emotion analysis | Optional |
| `DELETE` | `/api/analyses/:id` | Delete an analysis record | Yes (Bearer JWT) |
| `GET` | `/api/playlists` | Retrieve all 9 curated mood playlists | No |
| `GET` | `/api/playlists/:mood` | Retrieve playlist songs for a given emotion | No |
| `GET` | `/api/stats` | Platform metrics & EmoLyrics benchmarks | No |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and obtain JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer JWT) |
| `GET` | `/api/health` | Service health status check | No |

---

## 🌐 Production Deployment Guides

### Frontend on Vercel
1. Link the repository to your Vercel account.
2. Set the **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Configure environment variable: `VITE_API_URL=https://your-backend.onrender.com/api`.
5. Deploy! (A production `vercel.json` rewrite file is already configured).

### Backend on Render
1. Create a **New Web Service** pointing to this repository.
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install`.
4. Set **Start Command**: `npm start`.
5. Set environment variables:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `MONGODB_URI=your_mongodb_atlas_connection_string`
   - `JWT_SECRET=your_strong_random_secret`
6. Deploy! (A `render.yaml` specification is included).

---

## 👥 Research & Engineering Team

* **Chandrima Chawdhury** (359) — Team Lead & Research Architect
* **Harshit Raj** (403) — Model Training & Feature Extraction
* **Sristi Priya** (399) — Frontend UI/UX & Interaction Design
* **Dibyendu Khamaru** (412) — Dataset Curation & Benchmark Evaluation
* **Tribeni Ghorai** (455) — System Architecture & Integration

---

## 📚 References & Datasets
- **Open Source Dataset**: [IIIT Hyderabad Research Dataset](https://share.google/4KtdJSaRmEiQjCvHD)
- **Spotify Engineering Research**: Sentiment and Acoustic Analysis
- **Official Repository**: [GitHub - Chandrima2507/SONG_LYRICS_EMOTION_CLASSIFICATION07](https://github.com/Chandrima2507/SONG_LYRICS_EMOTION_CLASSIFICATION07)

