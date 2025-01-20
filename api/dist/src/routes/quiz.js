"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const quiz_controller_1 = require("../controller/quiz.controller");
const router = (0, express_1.Router)();
router.get('/:id', quiz_controller_1.getQuizById);
router.post('/:id/submit', quiz_controller_1.submitQuiz);
router.post('/:id/reset', quiz_controller_1.resetQuiz);
exports.default = router;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpei5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yb3V0ZXMvcXVpei50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFpQztBQUNqQyxtRUFBbUY7QUFFbkYsTUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBTSxHQUFFLENBQUM7QUFFeEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsNkJBQVcsQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLDRCQUFVLENBQUMsQ0FBQztBQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSwyQkFBUyxDQUFDLENBQUM7QUFFckMsa0JBQWUsTUFBTSxDQUFDIn0=