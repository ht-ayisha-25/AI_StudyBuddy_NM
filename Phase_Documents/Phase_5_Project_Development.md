# Phase 5: Project Development

## Source Code Information
The complete source code for the AI StudyBuddy backend API has been implemented and is located in the root of the repository.

### Key Components Developed:
- `index.js`: Main application entry point initializing Express, middleware, and routes.
- `src/utils/db.js`: MongoDB connection setup.
- `src/models/`: Mongoose schemas (`User.js`, `Material.js`).
- `src/middleware/`: 
  - `auth.js` for JWT verification and Role-Based Access Control.
  - `upload.js` for handling file uploads (txt, md, pdf) via Multer.
- `src/controllers/`: 
  - `authController.js` for handling user registration and login.
  - `materialController.js` for managing study materials and generating AI content (Summaries, Flashcards, Quizzes, Study Plans) via Gemini API.
- `src/utils/gemini.js`: Integration with the Google Gemini 2.5 Flash API.

## Environment Variables
Required `.env` setup:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```
