"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lesson_controller_1 = require("../controller/lesson.controller");
const router = (0, express_1.Router)();
router.get('/:category', lesson_controller_1.getLesson);
router.get('/:category/:id', lesson_controller_1.getLessonById);
router.post('/:category/:id/submit', lesson_controller_1.submitLesson);
router.post('/create', lesson_controller_1.createLesson);
router.post('/create/:id', lesson_controller_1.createLessonWIthId);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVzc29uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JvdXRlcy9sZXNzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBaUM7QUFDakMsdUVBQTJIO0FBRTNILE1BQU0sTUFBTSxHQUFHLElBQUEsZ0JBQU0sR0FBRSxDQUFDO0FBRXhCLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLDZCQUFTLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLGlDQUFhLENBQUMsQ0FBQztBQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLGdDQUFZLENBQUMsQ0FBQztBQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQ0FBWSxDQUFDLENBQUM7QUFFckMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsc0NBQWtCLENBQUMsQ0FBQztBQUUvQyxrQkFBZSxNQUFNLENBQUMifQ==