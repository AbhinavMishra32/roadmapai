import { Router } from "express";
import { getQuizById, resetQuiz, submitQuiz } from "../controller/quiz.controller";

const router = Router();

router.get('/:id', getQuizById);
router.post('/:id/submit', submitQuiz);
router.post('/:id/reset', resetQuiz);

export default router;