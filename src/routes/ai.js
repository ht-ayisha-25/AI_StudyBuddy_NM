const router = require("express").Router();
const { protect } = require("../middleware/auth");
const { flashcards, quiz, studyPlan } = require("../controllers/aiController");

router.use(protect); // all AI routes require authentication

router.post("/flashcards", flashcards);
router.post("/quiz", quiz);
router.post("/study-plan", studyPlan);

module.exports = router;
