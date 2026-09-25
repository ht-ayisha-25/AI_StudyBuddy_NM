# 📚 AI StudyBuddy — Complete API Documentation & Team Guide

---

## 🏗️ How The Application Works (The Restaurant Analogy)

Think of AI StudyBuddy like a **smart restaurant**:

| Restaurant | AI StudyBuddy |
|---|---|
| 🏠 The Restaurant Building | `index.js` — the Express server that receives all customers (requests) |
| 🚪 The Front Door | `cors` + `express.json()` middleware — checks who can enter and reads their order |
| 🪪 The Bouncer | `middleware/auth.js` — checks your JWT token (your ID card) before letting you in |
| 📋 The Menu (Routes) | `routes/auth.js`, `routes/materials.js`, `routes/ai.js`, `routes/admin.js` — tells the system which kitchen to send your order to |
| 👨‍🍳 The Chefs (Controllers) | `controllers/authController.js`, `materialController.js`, `aiController.js`, `adminController.js` — the actual cooks who prepare your food (process your request) |
| 🗄️ The Pantry (Database) | MongoDB Atlas — where all ingredients (users, materials) are stored |
| 🤖 The AI Chef Assistant | `utils/gemini.js` — Google Gemini AI that creates summaries, flashcards, quizzes, and study plans |
| 📦 The Storage Room | `uploads/` folder — temporary storage for uploaded files before they're read |

---

## 🔄 Application Startup Flow

When you run `npm start`, here's what happens step by step:

Step 1: npm start
Step 2: nodemon starts index.js (auto-restarts on file changes)
Step 3: dotenv loads .env file (PORT, MONGO_URI, JWT secrets, Gemini API key)
Step 4: Express app is created
Step 5: "uploads/" folder is created if it doesn't exist
Step 6: Middleware is registered:
         - express.json() → parses JSON request bodies
         - cors() → allows frontend at localhost:3000 to connect
Step 7: Routes are registered:
         - /api/auth      → authentication routes
         - /api/materials  → study material routes
         - /api/ai         → standalone AI routes
         - /api/admin      → admin-only routes
Step 8: connectDB() is called → Mongoose connects to MongoDB Atlas
Step 9: Server starts listening on PORT 5000
         ✅ "MongoDB connected: ..." 
         ✅ "Server running on port 5000"

---

## 🔌 Database Connection (MongoDB Atlas)

File: src/utils/db.js

Your App  ──→  Mongoose ODM  ──→  MongoDB Atlas (Cloud Database)

- What is MongoDB Atlas? A cloud-hosted NoSQL database. Your data lives on the internet, not on your laptop.
- What is Mongoose? A library that helps Node.js talk to MongoDB. It provides schemas (rules for how data looks) and easy query methods.
- Connection String: The MONGO_URI in .env is like a phone number — it tells Mongoose where the database lives, the username, and the password.

Two Collections (Tables) in the Database:

| Collection | What it stores | Schema File |
|---|---|---|
| users | Name, email, hashed password, role (student/admin) | models/User.js |
| materials | Title, content text, AI-generated summary/flashcards/quiz/study plan | models/Material.js |

---

## 🤖 Gemini AI Connection

File: src/utils/gemini.js

Your App  ──→  @google/generative-ai SDK  ──→  Google Gemini 3.6 Flash API

- How it works: When you call any AI endpoint, the controller builds a prompt (a text instruction), sends it to Google's Gemini API, and gets back AI-generated text.
- The API Key in .env authenticates your app with Google's servers.
- Model used: gemini-3.6-flash — fast and efficient for text generation.

Example flow for generating flashcards:
1. User calls POST /api/materials/:id/flashcards
2. Controller fetches the material content from MongoDB
3. Controller builds a prompt: "Create 5 flashcards from this text..."
4. askGemini(prompt) sends the prompt to Google Gemini API
5. Gemini returns JSON with flashcards
6. Controller saves flashcards to the material in MongoDB
7. Response sent back to user

---

## 🔐 Authentication Flow (JWT Tokens)

Register/Login → Server creates 2 tokens:
   - Access Token  (expires in 15 minutes) — used for every API call
   - Refresh Token (expires in 7 days) — used to get new access token

Every protected API call:
   Client sends: Authorization: Bearer <accessToken>
   auth.js middleware verifies the token
   If valid → request proceeds
   If expired → client uses refresh token to get a new access token

---

## 📂 Project File Structure Explained

AI-StudyBuddy/
├── .env                          ← Environment variables (secrets)
├── .gitignore                    ← Files to exclude from git
├── index.js                      ← 🚀 App entry point — starts everything
├── package.json                  ← Project config & dependencies
│
├── uploads/                      ← Temp folder for file uploads
│
└── src/
    ├── controllers/              ← 👨‍🍳 Business logic (the "chefs")
    │   ├── authController.js     ← Register, login, refresh, logout
    │   ├── materialController.js ← Upload, CRUD, AI features on materials
    │   ├── aiController.js       ← Standalone AI endpoints
    │   └── adminController.js    ← Admin-only operations
    │
    ├── middleware/                ← 🚪 Request filters (run before controllers)
    │   ├── auth.js               ← JWT verification + admin check
    │   └── upload.js             ← Multer file upload handler
    │
    ├── models/                   ← 🗄️ Database schemas
    │   ├── User.js               ← User schema + password hashing
    │   └── Material.js           ← Material schema + AI fields
    │
    ├── routes/                   ← 📋 URL → Controller mapping
    │   ├── auth.js               ← /api/auth/* routes
    │   ├── materials.js          ← /api/materials/* routes
    │   ├── ai.js                 ← /api/ai/* routes
    │   └── admin.js              ← /api/admin/* routes
    │
    └── utils/                    ← 🔧 Helper modules
        ├── db.js                 ← MongoDB connection
        ├── gemini.js             ← Google Gemini AI integration
        └── tokens.js             ← JWT token generation

---

## 🧪 ALL API ENDPOINTS — Curl Commands for Postman

Base URL: http://localhost:5000

How to use in Postman:
1. Set the HTTP method (GET/POST/DELETE)
2. Paste the URL
3. For POST requests: go to Body → raw → JSON, paste the body
4. For protected routes: go to Headers → add Authorization: Bearer <your_token>

---

### 🔐 1. AUTHENTICATION APIs

---

#### 1.1 Register a New User

What it does: Creates a new user account. The password is automatically hashed (encrypted) before storing. Returns JWT tokens for immediate use.

POST /api/auth/register

Curl Command:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ayisha",
    "email": "ayisha@example.com",
    "password": "mypassword123"
  }'

To register as admin:
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "adminpass123",
    "role": "admin"
  }'

Response:
{
  "message": "Registered successfully",
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "user": {
    "id": "6ab24fc95b7a985a706d2ee9",
    "name": "Ayisha",
    "role": "student"
  }
}

💡 Save the accessToken — you need it for all protected routes below!

---

#### 1.2 Login

What it does: Authenticates an existing user with email + password. Returns fresh JWT tokens.

POST /api/auth/login

Curl Command:
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ayisha@example.com",
    "password": "mypassword123"
  }'

Response:
{
  "message": "Logged in",
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "user": {
    "id": "6ab24fc95b7a985a706d2ee9",
    "name": "Ayisha",
    "role": "student"
  }
}

---

#### 1.3 Refresh Token

What it does: When your access token expires (after 15 min), use the refresh token to get a new pair of tokens without logging in again.

POST /api/auth/refresh

Curl Command:
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.73C-T6O4"

Response:
{
  "message": "Tokens refreshed",
  "accessToken": "eyJhbGciOi... (new)",
  "refreshToken": "eyJhbGciOi... (new)"
}

---

#### 1.4 Logout

What it does: Stateless logout — the server acknowledges, and the client should discard stored tokens.

POST /api/auth/logout

Curl Command:
curl -X POST http://localhost:5000/api/auth/logout

Response:
{
  "message": "Logged out"
}

---

### 📄 2. STUDY MATERIAL APIs

⚠️ All material routes require authentication. Add this header to every request:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k

---

#### 2.1 Upload Study Material

What it does: Uploads a .txt, .md, or .pdf file (max 5MB). The server reads the text content, stores it in MongoDB, and deletes the temp file.

POST /api/materials/upload

Curl Command:
curl -X POST http://localhost:5000/api/materials/upload \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k" \
  -F "file=@./sample_biology_notes.txt" \
  -F "title=My Study Notes"

In Postman:
- Method: POST
- Body: form-data
- Key: file (type: File) → select your file
- Key: title (type: Text) → enter the title

Response:
{
  "message": "Material uploaded",
  "material": {
    "_id": "6ab24ff25b7a985a706d2eea",
    "user": "6ab24fc95b7a985a706d2ee9",
    "title": "My Study Notes",
    "content": "The full text content of the file...",
    "filename": "notes.txt",
    "flashcards": [],
    "quiz": [],
    "createdAt": "2026-09-22T09:52:50.146Z"
  }
}

💡 Save the _id — you need it for AI features and other operations!

---

#### 2.2 Get All Materials

What it does: Returns a list of all your uploaded materials (students see only their own, admins see all). Content and AI data are excluded for speed.

GET /api/materials

Curl Command:
curl http://localhost:5000/api/materials \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k"

Response:
[
  {
    "_id": "6ab24ff25b7a985a706d2eea",
    "user": "6ab24fc95b7a985a706d2ee9",
    "title": "My Study Notes",
    "filename": "notes.txt",
    "createdAt": "2026-09-22T09:52:50.146Z"
  }
]

---

#### 2.3 Get Single Material (Full Details)

What it does: Returns a single material with all data including content, summary, flashcards, quiz, and study plan.

GET /api/materials/:id

Curl Command:
curl http://localhost:5000/api/materials/6ab24ff25b7a985a706d2eea \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k"

---

#### 2.4 Delete Material

What it does: Permanently deletes a material. Students can only delete their own; admins can delete any.

DELETE /api/materials/:id

Curl Command:
curl -X DELETE http://localhost:5000/api/materials/6ab24ff25b7a985a706d2eea \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k"

Response:
{
  "message": "Deleted"
}

---

### 🤖 3. AI FEATURE APIs (via Material ID in URL)

These endpoints take the material ID from the URL and generate AI content using that material's text.

---

#### 3.1 Generate AI Summary

What it does: Sends the material content to Gemini AI and generates a concise bullet-point summary. The summary is saved to the material in the database.

POST /api/materials/:id/summarize

Curl Command:
curl -X POST http://localhost:5000/api/materials/6ab24ff25b7a985a706d2eea/summarize \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k" \
  -H "Content-Type: application/json"

Response:
{
  "summary": "• Photosynthesis is the process green plants use to make food...\n• It involves chlorophyll...\n• It generates oxygen as a byproduct..."
}

---

#### 3.2 Generate AI Flashcards (via material URL)

What it does: Creates Q&A flashcards from the study material for revision. You can control how many with count.

POST /api/materials/:id/flashcards

Curl Command:
curl -X POST http://localhost:5000/api/materials/6ab24ff25b7a985a706d2eea/flashcards \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k" \
  -H "Content-Type: application/json" \
  -d '{"count": 5}'

Response:
{
  "flashcards": [
    {
      "question": "What is photosynthesis?",
      "answer": "The process by which green plants use sunlight to synthesize foods."
    },
    {
      "question": "What gas is a byproduct of photosynthesis?",
      "answer": "Oxygen."
    }
  ]
}

---

#### 3.3 Generate AI Quiz (via material URL)

What it does: Creates multiple-choice quiz questions from the study material. Returns questions with 4 options and the correct answer.

POST /api/materials/:id/quiz

Curl Command:
curl -X POST http://localhost:5000/api/materials/6ab24ff25b7a985a706d2eea/quiz \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k" \
  -H "Content-Type: application/json" \
  -d '{"count": 5}'

Response:
{
  "quiz": [
    {
      "question": "In which organelle does photosynthesis take place?",
      "options": ["Chloroplasts", "Mitochondria", "Nucleus", "Ribosomes"],
      "answer": "Chloroplasts"
    }
  ]
}

---

#### 3.4 Generate AI Study Plan (via material URL)

What it does: Creates a personalized day-by-day study schedule. You can specify your goal, available hours per day, and number of days.

POST /api/materials/:id/study-plan

Curl Command:
curl -X POST http://localhost:5000/api/materials/6ab24ff25b7a985a706d2eea/study-plan \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k" \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Master the topic for exams",
    "hoursPerDay": 2,
    "days": 7
  }'

Response:
{
  "studyPlan": "Day 1: Introduction & Core Concepts (2 hours)...\nDay 2: Deep Dive..."
}

---

### 🤖 4. STANDALONE AI APIs (material ID in request body)

These are alternate routes that accept materialId in the JSON body instead of the URL. Same AI functionality, different interface.

---

#### 4.1 Generate Flashcards (Standalone)

POST /api/ai/flashcards

Curl Command:
curl -X POST http://localhost:5000/api/ai/flashcards \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k" \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": "6ab24ff25b7a985a706d2eea",
    "count": 3
  }'

---

#### 4.2 Generate Quiz (Standalone)

POST /api/ai/quiz

Curl Command:
curl -X POST http://localhost:5000/api/ai/quiz \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k" \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": "6ab24ff25b7a985a706d2eea",
    "count": 5
  }'

---

#### 4.3 Generate Study Plan (Standalone)

POST /api/ai/study-plan

Curl Command:
curl -X POST http://localhost:5000/api/ai/study-plan \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYjI0ZmM5NWI3YTk4NWE3MDZkMmVlOSJ9.xZ8_4k" \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": "6ab24ff25b7a985a706d2eea",
    "goal": "Understand the topic thoroughly",
    "hoursPerDay": 2,
    "days": 5
  }'

---

### 🛡️ 5. ADMIN APIs

⚠️ Admin-only! You must be logged in as a user with role: "admin". Regular students will get a 403 Forbidden error.

---

#### 5.1 Get All Users

What it does: Returns a list of all registered users (password excluded for security).

GET /api/admin/users

Curl Command:
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYzM1ZWE5NWI3YTk4NWE3MDZkMmVlOSJ9.aB2_9p"

Response:
[
  {
    "_id": "6ab24fc95b7a985a706d2ee9",
    "name": "Ayisha",
    "email": "ayisha@example.com",
    "role": "student",
    "createdAt": "2026-09-22T09:52:09.000Z"
  }
]

---

#### 5.2 Delete a User

What it does: Deletes a user and all their uploaded materials from the database.

DELETE /api/admin/users/:id

Curl Command:
curl -X DELETE http://localhost:5000/api/admin/users/6ab24fc95b7a985a706d2ee9 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYzM1ZWE5NWI3YTk4NWE3MDZkMmVlOSJ9.aB2_9p"

Response:
{
  "message": "User and their materials deleted"
}

---

#### 5.3 Get Platform Stats

What it does: Returns total number of students and total uploaded materials on the platform.

GET /api/admin/stats

Curl Command:
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYzM1ZWE5NWI3YTk4NWE3MDZkMmVlOSJ9.aB2_9p"

Response:
{
  "totalUsers": 5,
  "totalMaterials": 12
}

---

## 🚀 Quick Start Guide for Teammates

# Step 1: Clone the project
cd AI-StudyBuddy

# Step 2: Install dependencies
npm install

# Step 3: Make sure .env file exists with these variables:
#   PORT=5000
#   MONGO_URI=mongodb+srv://...
#   JWT_ACCESS_SECRET=nm_jwt_secret
#   JWT_REFRESH_SECRET=nm_jwt_refresh_secret
#   GEMINI_API_KEY=your_key
#   NODE_ENV=development

# Step 4: Start the server
npm start

# Step 5: Test the health check
curl http://localhost:5000/
# Should return: {"message":"AI StudyBuddy API is running"}

# Step 6: Register, login, upload material, and test AI features!

---

## 📊 Complete API Summary Table

| # | Method | Endpoint | Auth Required | Description |
|---|---|---|---|---|
| 1 | POST | /api/auth/register | No | Create new user account |
| 2 | POST | /api/auth/login | No | Login and get JWT tokens |
| 3 | POST | /api/auth/refresh | No | Refresh expired access token |
| 4 | POST | /api/auth/logout | No | Logout (discard tokens) |
| 5 | POST | /api/materials/upload | Yes | Upload a study material file |
| 6 | GET | /api/materials | Yes | List all your materials |
| 7 | GET | /api/materials/:id | Yes | Get full material details |
| 8 | DELETE | /api/materials/:id | Yes | Delete a material |
| 9 | POST | /api/materials/:id/summarize | Yes | AI: Generate summary |
| 10 | POST | /api/materials/:id/flashcards | Yes | AI: Generate flashcards |
| 11 | POST | /api/materials/:id/quiz | Yes | AI: Generate quiz |
| 12 | POST | /api/materials/:id/study-plan | Yes | AI: Generate study plan |
| 13 | POST | /api/ai/flashcards | Yes | AI: Flashcards (standalone) |
| 14 | POST | /api/ai/quiz | Yes | AI: Quiz (standalone) |
| 15 | POST | /api/ai/study-plan | Yes | AI: Study plan (standalone) |
| 16 | GET | /api/admin/users | Admin | List all users |
| 17 | DELETE | /api/admin/users/:id | Admin | Delete a user |
| 18 | GET | /api/admin/stats | Admin | Platform statistics |
