import { Router } from "express";
import { getLesson, getLessonById, submitLesson, createLesson, createLessonWIthId } from "../controller/lesson.controller";

const router = Router();

router.get('/:category', getLesson);
router.get('/:category/:id', getLessonById);
router.post('/:category/:id/submit', submitLesson);
router.post('/create', createLesson);

router.post('/create/:id', createLessonWIthId);

export default router;