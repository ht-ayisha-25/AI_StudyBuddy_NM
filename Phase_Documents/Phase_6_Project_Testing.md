# Phase 6: Project Testing

## API Testing using Postman

All major endpoints have been successfully tested using Postman.

### 1. User Authentication
- **Register (POST /api/auth/register):** Returns `201 Created` with JWT access tokens.
- **Login (POST /api/auth/login):** Returns `200 OK` with JWT access tokens.

### 2. Study Material Management
- **Upload Material (POST /api/materials/upload):** 
  - Body: form-data (file, title).
  - Returns `201 Created` and successfully parses the file content.
- **Get Materials (GET /api/materials):** Returns a list of the user's uploaded materials.

### 3. AI Feature Testing
- **Generate Summary (POST /api/materials/:id/summarize):** Returns `200 OK` with concise summaries via Gemini.
- **Generate Flashcards (POST /api/materials/:id/flashcards):** Returns JSON array of Q&A flashcards.
- **Generate Quiz (POST /api/materials/:id/quiz):** Returns JSON array of multiple-choice questions.
- **Generate Study Plan (POST /api/materials/:id/study-plan):** Returns a personalized study schedule.

*(Check the reference PDF document for actual Postman screenshots).*
