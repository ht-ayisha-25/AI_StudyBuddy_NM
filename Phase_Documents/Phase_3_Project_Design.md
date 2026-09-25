# Phase 3: Project Design

*Note: The actual diagrams are available in the project's PDF document (_AI StudyBuddy.docx.pdf).*

## 1. System Architecture (Epic 1)
The AI StudyBuddy backend follows a modular RESTful architecture separating routing, controllers, middleware, models, and utils. 
- **API Gateway/Routes:** Handles incoming client requests.
- **Authentication Middleware:** Validates JWTs before allowing access.
- **AI Service Layer:** Communicates with Google Gemini API.
- **Database Layer:** MongoDB with Mongoose ODM.

## 2. Entity-Relationship (ER) Model
Entities identified:
- **User:** _id, name, email, password, role
- **Study Material:** _id, userId, title, subject, content
- **Summary:** _id, userId, materialId, summary
- **Flashcard:** _id, userId, materialId, question, answer
- **Quiz:** _id, userId, materialId, questions[]
- **Study Plan:** _id, userId, studyPlan, examDate

**Relationships:**
- User -> Study Material (1:N)
- Study Material -> Summary (1:1)
- Study Material -> Flashcard (1:N)
- Study Material -> Quiz (1:1)

## 3. MVC Architecture Pattern
- **Model:** Mongoose Schemas (User, Material).
- **View:** JSON Responses sent back via API Routes.
- **Controller:** Business logic (authController, materialController).
