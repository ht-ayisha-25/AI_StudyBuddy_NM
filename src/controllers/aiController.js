const Material = require("../models/Material");
const { askGemini } = require("../utils/gemini");

// POST /api/ai/flashcards
// Body: { materialId, count }
const flashcards = async (req, res) => {
  const { materialId, count = 5 } = req.body;
  if (!materialId) return res.status(400).json({ message: "materialId is required" });

  const material = await Material.findById(materialId);
  if (!material) return res.status(404).json({ message: "Material not found" });

  // Ownership check — students can only access their own materials
  if (req.user.role !== "admin" && material.user.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const prompt = `
Create ${count} flashcards from the study material below.
Return ONLY valid JSON in this format, no extra text:
[{"question": "...", "answer": "..."}]

Study material:
${material.content}
`;

  const raw = await askGemini(prompt);
  const clean = raw.replace(/```json|```/g, "").trim();
  const flashcardsData = JSON.parse(clean);

  material.flashcards = flashcardsData;
  await material.save();

  res.json({ flashcards: flashcardsData });
};

// POST /api/ai/quiz
// Body: { materialId, count }
const quiz = async (req, res) => {
  const { materialId, count = 5 } = req.body;
  if (!materialId) return res.status(400).json({ message: "materialId is required" });

  const material = await Material.findById(materialId);
  if (!material) return res.status(404).json({ message: "Material not found" });

  if (req.user.role !== "admin" && material.user.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const prompt = `
Create ${count} multiple choice quiz questions from the study material below.
Return ONLY valid JSON in this format, no extra text:
[{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A"}]

Study material:
${material.content}
`;

  const raw = await askGemini(prompt);
  const clean = raw.replace(/```json|```/g, "").trim();
  const quizData = JSON.parse(clean);

  material.quiz = quizData;
  await material.save();

  res.json({ quiz: quizData });
};

// POST /api/ai/study-plan
// Body: { materialId, goal, hoursPerDay, days }
const studyPlan = async (req, res) => {
  const { materialId, goal, hoursPerDay, days } = req.body;
  if (!materialId) return res.status(400).json({ message: "materialId is required" });

  const material = await Material.findById(materialId);
  if (!material) return res.status(404).json({ message: "Material not found" });

  if (req.user.role !== "admin" && material.user.toString() !== req.user.userId) {
    return res.status(403).json({ message: "Access denied" });
  }

  const prompt = `
You are a study planner. Based on the study material below, create a personalized ${days || 7}-day study plan.
Student's goal: ${goal || "Understand and retain the material"}
Available study time: ${hoursPerDay || 2} hours per day.

Return a clear day-by-day schedule with topics and activities.

Study material:
${material.content}
`;

  const studyPlanData = await askGemini(prompt);

  material.studyPlan = studyPlanData;
  await material.save();

  res.json({ studyPlan: studyPlanData });
};

module.exports = { flashcards, quiz, studyPlan };
